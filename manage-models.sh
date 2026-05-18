#!/usr/bin/env bash
# Interactive Ollama model manager: list / update (pull) / remove
# Robust I/O, strict error handling, and no DNS reliance.

set -Eeuo pipefail
IFS=$'\n\t'
trap 'ec=$?; echo "ERROR: line $LINENO exit $ec" >&2; exit $ec' ERR

# -------------------- deps --------------------
need(){ command -v "$1" >/dev/null 2>&1 || { echo "ERROR: $1 not found" >&2; exit 127; }; }
need curl; need jq; need mktemp

# -------------------- config --------------------
CURL_TIMEOUT="${CURL_TIMEOUT:-0}"           # 0 = no overall limit (safe for large pulls)
CURL_CONNECT_TIMEOUT="${CURL_CONNECT_TIMEOUT:-10}"
RETRY_COUNT="${RETRY_COUNT:-2}"
RETRY_DELAY="${RETRY_DELAY:-2}"

# -------------------- env --------------------
[[ -f .env ]] || { echo "ERROR: .env not found in $(pwd)" >&2; exit 1; }
set +u
# shellcheck disable=SC1091
source .env
set -u

: "${OLLAMA_IP:?Set OLLAMA_IP in .env}"
: "${OLLAMA_PORT:?Set OLLAMA_PORT in .env}"
O_HOST="http://${OLLAMA_IP}:${OLLAMA_PORT}"

# -------------------- I/O --------------------
TTY_IN="/dev/tty"
[[ -r "$TTY_IN" ]] || { echo "ERROR: No interactive TTY. Run this in a terminal." >&2; exit 1; }

# -------------------- housekeeping --------------------
declare -a TMP_FILES=()
cleanup(){ for f in "${TMP_FILES[@]:-}"; do [[ -f "$f" ]] && rm -f "$f"; done; }
trap cleanup EXIT
die(){ echo "ERROR: $*" >&2; exit 1; }

# -------------------- HTTP --------------------
http_request(){
  # Usage: http_request METHOD PATH [JSON]
  local method="${1:?METHOD missing}" path="${2:?PATH missing}" data="${3-}"
  local url="${O_HOST}${path}" tmp code
  tmp="$(mktemp)" || die "mktemp failed"; TMP_FILES+=("$tmp")

  if [[ -n "$data" ]]; then
    code="$(
      curl -sS \
           --connect-timeout "$CURL_CONNECT_TIMEOUT" \
           -m "$CURL_TIMEOUT" \
           --retry "$RETRY_COUNT" --retry-delay "$RETRY_DELAY" \
           -w '%{http_code}' -o "$tmp" \
           -H 'Content-Type: application/json' \
           -X "$method" "$url" -d "$data"
    )" || true
  else
    code="$(
      curl -sS \
           --connect-timeout "$CURL_CONNECT_TIMEOUT" \
           -m "$CURL_TIMEOUT" \
           --retry "$RETRY_COUNT" --retry-delay "$RETRY_DELAY" \
           -w '%{http_code}' -o "$tmp" \
           -X "$method" "$url"
    )" || true
  fi

  HTTP_CODE="${code:-000}"
  HTTP_BODY_FILE="$tmp"

  if [[ "$HTTP_CODE" -lt 200 || "$HTTP_CODE" -ge 300 ]]; then
    echo "HTTP $HTTP_CODE $url" >&2
    [[ -s "$tmp" ]] && { jq -C . "$tmp" 2>/dev/null || cat "$tmp"; } >&2
    return 1
  fi
  return 0
}

# -------------------- API wrappers --------------------
check_server(){
  http_request GET /api/version "" || die "Cannot reach ${O_HOST}/api/version"
  local ver; ver="$(jq -r '.version // empty' "$HTTP_BODY_FILE")"
  [[ -n "$ver" ]] || die "Unexpected /api/version response"
  echo "✓ Ollama at $O_HOST (version $ver)"
}

list_models_json(){ http_request GET /api/tags "" || die "Failed to list models"; cat "$HTTP_BODY_FILE"; }

get_model_names(){
  # Fills global MODELS[] with names; no "mapfile" dependency.
  MODELS=()
  local json; json="$(list_models_json)"
  while IFS= read -r n; do [[ -n "$n" ]] && MODELS+=("$n"); done < <(jq -r '.models[]? | .name // empty' <<<"$json")
}

list_models_table(){
  local json; json="$(list_models_json)"
  local n; n="$(jq '(.models // []) | length' <<<"$json")"
  if [[ "$n" -eq 0 ]]; then echo "No models installed."; return 0; fi
  echo; echo "📦 Installed models:"
  jq -r '
    (.models // []) | to_entries |
    map("\(.key+1)) " + (.value.name) + " | " +
        (((.value.details.parameter_size // "?") + " / " + (.value.details.quantization_level // "?"))) + " | " +
        (.value.modified_at // "?")) | .[]' <<<"$json"
}

pull_model(){
  local name="${1:?model name missing}"
  echo "🔄 Pulling \"$name\"..."
  if http_request POST /api/pull "$(jq -cn --arg v "$name" '{model:$v,stream:false}')" \
     || http_request POST /api/pull "$(jq -cn --arg v "$name" '{name:$v,stream:false}')"; then
    jq -C . "$HTTP_BODY_FILE" 2>/dev/null || true
    echo "✓ Pull completed for $name"
    return 0
  else
    echo "ERROR: Pull failed for $name" >&2
    return 1
  fi
}

delete_model(){
  local name="${1:?model name missing}"
  echo "🗑️  Deleting \"$name\"..."
  if http_request DELETE /api/delete "$(jq -cn --arg v "$name" '{name:$v}')" \
     || http_request DELETE /api/delete "$(jq -cn --arg v "$name" '{model:$v}')"; then
    echo "✓ Deleted $name"
    return 0
  else
    echo "ERROR: Delete failed for $name" >&2
    return 1
  fi
}

pull_all(){
  get_model_names
  [[ "${#MODELS[@]}" -gt 0 ]] || { echo "No models to update."; return 0; }
  local ok=0 fail=0
  for m in "${MODELS[@]}"; do pull_model "$m" && ((ok++)) || ((fail++)); done
  echo "Update summary: ${ok} succeeded, ${fail} failed."
}

delete_all(){
  get_model_names
  [[ "${#MODELS[@]}" -gt 0 ]] || { echo "No models to remove."; return 0; }
  printf "Type 'YES' to delete ALL models: " >&2
  local ack; read -r ack < "$TTY_IN" || { echo "Aborted." >&2; return 1; }
  [[ "$ack" == "YES" ]] || { echo "Aborted." >&2; return 1; }
  local ok=0 fail=0
  for m in "${MODELS[@]}"; do delete_model "$m" && ((ok++)) || ((fail++)); done
  echo "Delete summary: ${ok} succeeded, ${fail} failed."
}

# -------------------- UI helpers --------------------
select_model_prompt(){
  get_model_names
  if [[ "${#MODELS[@]}" -eq 0 ]]; then echo "No models installed." >&2; return 1; fi

  # IMPORTANT: UI -> STDERR, only the chosen name -> STDOUT
  list_models_table >&2
  echo >&2
  printf 'Enter number or exact model (blank cancels): ' >&2

  local sel; if ! IFS= read -r sel < "$TTY_IN"; then echo "Cancelled." >&2; return 1; fi
  [[ -z "$sel" ]] && { echo "Cancelled." >&2; return 1; }

  local out
  if [[ "$sel" =~ ^[0-9]+$ ]]; then
    local idx=$((sel-1))
    (( idx >= 0 && idx < ${#MODELS[@]} )) || { echo "Invalid selection." >&2; return 1; }
    out="${MODELS[$idx]}"
  else
    out="$sel"
  fi

  printf '%s\n' "$out"   # ONLY the model name to STDOUT
}

menu_loop(){
  while true; do
    echo; list_models_table; echo
    echo "[U]pdate one  [A] Update all  [R]emove one  [X] Remove all  [P]ull new by name  [L]ist  [Q]uit"
    printf "Choice: " >&2
    local choice; if ! read -r choice < "$TTY_IN"; then echo "No input; exiting."; exit 0; fi
    case "${choice^^}" in
      U)
        if name="$(select_model_prompt)"; then pull_model "$name" || true; fi
        ;;
      A)
        printf "Update ALL models? [y/N]: " >&2
        local yn; read -r yn < "$TTY_IN" || { echo "Skipped."; continue; }
        [[ "${yn,,}" == "y" ]] && pull_all || echo "Skipped."
        ;;
      R)
        if name="$(select_model_prompt)"; then
          printf "Delete '%s'? [y/N]: " "$name" >&2
          local yn; read -r yn < "$TTY_IN" || { echo "Skipped."; continue; }
          [[ "${yn,,}" == "y" ]] && delete_model "$name" || echo "Skipped."
        fi
        ;;
      X)
        delete_all || true
        ;;
      P)
        printf "Enter model (e.g., llama3.2:latest): " >&2
        local m; read -r m < "$TTY_IN" || { echo "No model specified."; continue; }
        [[ -n "${m:-}" ]] && pull_model "$m" || echo "No model specified."
        ;;
      L) : ;;   # re-list
      Q) echo "Bye."; exit 0 ;;
      *) echo "Unknown choice." ;;
    esac
  done
}

# -------------------- run --------------------
check_server
menu_loop
