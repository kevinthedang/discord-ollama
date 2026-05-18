#!/usr/bin/env bash
# Interactive Ollama model manager (list / update / remove)
# Uses OLLAMA_IP and OLLAMA_PORT from .env. No DNS required.

set -euo pipefail
IFS=$'\n\t'

# ---------- deps ----------
need() { command -v "$1" >/dev/null 2>&1 || { printf 'ERROR: %s not found\n' "$1" >&2; exit 1; }; }
need curl
need jq
need mktemp

# ---------- config ----------
CURL_TIMEOUT="${CURL_TIMEOUT:-0}"            # 0 = no max-time (large pulls)
CURL_CONNECT_TIMEOUT="${CURL_CONNECT_TIMEOUT:-10}"
RETRY_COUNT="${RETRY_COUNT:-2}"
RETRY_DELAY="${RETRY_DELAY:-2}"

# ---------- env ----------
[[ -f .env ]] || { echo "ERROR: .env not found in $(pwd)"; exit 1; }
set +u
# shellcheck disable=SC1091
source .env
set -u

: "${OLLAMA_IP:?Set OLLAMA_IP in .env}"
: "${OLLAMA_PORT:?Set OLLAMA_PORT in .env}"
O_HOST="http://${OLLAMA_IP}:${OLLAMA_PORT}"

# ---------- housekeeping ----------
declare -a TMP_FILES=()
cleanup(){ for f in "${TMP_FILES[@]:-}"; do [[ -f "$f" ]] && rm -f "$f"; done; }
trap cleanup EXIT
die(){ printf 'ERROR: %s\n' "$*" >&2; exit 1; }

# ---------- HTTP ----------
# http_request METHOD PATH [JSON]
http_request() {
  local method="${1:?METHOD missing}" path="${2:?PATH missing}" data="${3-}"
  local url="${O_HOST}${path}" tmp code
  tmp="$(mktemp)" || die "mktemp failed"; TMP_FILES+=("$tmp")
  if [[ -n "$data" ]]; then
    code="$(
      curl -sS --connect-timeout "$CURL_CONNECT_TIMEOUT" -m "$CURL_TIMEOUT" \
        --retry "$RETRY_COUNT" --retry-delay "$RETRY_DELAY" \
        -w '%{http_code}' -o "$tmp" \
        -H 'Content-Type: application/json' -X "$method" "$url" -d "$data"
    )" || true
  else
    code="$(
      curl -sS --connect-timeout "$CURL_CONNECT_TIMEOUT" -m "$CURL_TIMEOUT" \
        --retry "$RETRY_COUNT" --retry-delay "$RETRY_DELAY" \
        -w '%{http_code}' -o "$tmp" -X "$method" "$url"
    )" || true
  fi
  HTTP_CODE="${code:-000}"; HTTP_BODY_FILE="$tmp"
  if [[ "$HTTP_CODE" -lt 200 || "$HTTP_CODE" -ge 300 ]]; then
    printf 'HTTP %s %s\n' "$HTTP_CODE" "$url" >&2
    [[ -s "$tmp" ]] && { jq -C . "$tmp" 2>/dev/null || cat "$tmp"; } >&2
    return 1
  fi
  return 0
}

# ---------- API ----------
check_server(){
  http_request GET /api/version "" || die "Cannot reach ${O_HOST}/api/version"
  local ver; ver="$(jq -r '.version // empty' "$HTTP_BODY_FILE")"
  [[ -n "$ver" ]] || die "Unexpected /api/version response"
  printf '✓ Ollama at %s (version %s)\n' "$O_HOST" "$ver"
}

list_models_json(){ http_request GET /api/tags "" || die "Failed to list models"; cat "$HTTP_BODY_FILE"; }

declare -a MODELS=()
get_model_names(){
  MODELS=()
  local json; json="$(list_models_json)"
  mapfile -t MODELS < <(jq -r '.models[]? | .name // empty' <<<"$json") || MODELS=()
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
  else
    die "Pull failed for $name"
  fi
}

pull_all(){
  get_model_names
  [[ "${#MODELS[@]}" -gt 0 ]] || { echo "No models to update."; return 0; }
  for m in "${MODELS[@]}"; do pull_model "$m"; done
}

delete_model(){
  local name="${1:?model name missing}"
  echo "🗑️  Deleting \"$name\"..."
  if http_request DELETE /api/delete "$(jq -cn --arg v "$name" '{name:$v}')" \
     || http_request DELETE /api/delete "$(jq -cn --arg v "$name" '{model:$v}')"; then
    echo "✓ Deleted $name"
  else
    die "Delete failed for $name"
  fi
}

delete_all(){
  get_model_names
  [[ "${#MODELS[@]}" -gt 0 ]] || { echo "No models to remove."; return 0; }
  read -r -p "Type 'YES' to delete ALL models: " ack
  [[ "$ack" == "YES" ]] || { echo "Aborted."; return 1; }
  for m in "${MODELS[@]}"; do delete_model "$m"; done
}

# ---------- UI ----------
select_model_prompt(){
  get_model_names
  [[ "${#MODELS[@]}" -gt 0 ]] || { echo "No models installed."; return 1; }
  list_models_table; echo
  local sel=""; read -r -p "Enter number or exact model (blank cancels): " sel || { echo "Cancelled."; return 1; }
  [[ -z "${sel:-}" ]] && { echo "Cancelled."; return 1; }
  if [[ "$sel" =~ ^[0-9]+$ ]]; then
    local idx=$((sel-1)); (( idx>=0 && idx<${#MODELS[@]} )) || { echo "Invalid selection."; return 1; }
    printf '%s\n' "${MODELS[$idx]}"
  else
    printf '%s\n' "$sel"
  fi
}

menu_loop(){
  while true; do
    echo; list_models_table; echo
    echo "[U]pdate one  [A] Update all  [R]emove one  [X] Remove all  [P]ull new by name  [L]ist  [Q]uit"
    local choice=""; read -r -p "Choice: " choice || { echo "Bye."; return 0; }
    case "${choice^^}" in
      U) if name="$(select_model_prompt)"; then pull_model "$name"; fi ;;
      A) read -r -p "Update ALL models? [y/N]: " yn; [[ "${yn,,}" == "y" ]] && pull_all || echo "Skipped." ;;
      R) if name="$(select_model_prompt)"; then read -r -p "Delete '$name'? [y/N]: " yn; [[ "${yn,,}" == "y" ]] && delete_model "$name" || echo "Skipped."; fi ;;
      X) delete_all || true ;;
      P) local m=""; read -r -p "Enter model (e.g., llama3.2:latest): " m; [[ -n "${m:-}" ]] && pull_model "$m" || echo "No model specified." ;;
      L) : ;;
      Q) echo "Bye."; return 0 ;;
      *) echo "Unknown choice."; ;;
    esac
  done
}

# ---------- run ----------
check_server
menu_loop
