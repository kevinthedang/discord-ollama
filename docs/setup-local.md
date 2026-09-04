## Ollama Setup
* Go to Ollama's [Linux download page](https://ollama.ai/download/linux) and run the simple curl command they provide. The command should be `curl https://ollama.ai/install.sh | sh`.
* Since Ollama will run as a systemd service, there is no need to run `ollama serve` unless you disable it. If you do disable it or have an older `ollama` version, do the following:
    * In terminal 1 -> `ollama serve` to setup ollama
    * In terminal 2 -> `ollama run [model name]`, for example `ollama run llama2`
        * The models can vary as you can create your own model. You can also view ollama's [library](https://ollama.ai/library) of models.
* Otherwise, if you have the latest `ollama`, you can just run `ollama run [model name]` rather than running this in 2 terminals.
* If there are any issues running ollama because of missing LLMs, run `ollama pull [model name]` as it will pull the model if Ollama has it in their library.
    * This can also be done in [wsl](https://learn.microsoft.com/en-us/windows/wsl/install) for Windows machines.
    * This should also not be a problem is a future feature that allows for pulling of models via discord client. For now, they must be pulled manually.
* You can now interact with the model you just ran (it might take a second to startup).
    * Response time varies with processing power!

> [!NOTE]  
> You can now pull models directly from the Discord client using `/pull-model <model-name>` or `/switch-model <model-name>`. They must exist from your local model library or from the [Ollama Model Library](https://ollama.com/library)

## Using with llmman (alternative to Ollama)
* [llmman](https://github.com/llmmanorg/llmman) is a local model runner that serves the Ollama API on port `17434`. The bot talks to it exactly as it would to Ollama, only the port differs.
* Install it with `curl -fsSL https://raw.githubusercontent.com/llmmanorg/llmman/main/install.sh | sh` (Linux/macOS) or `irm https://raw.githubusercontent.com/llmmanorg/llmman/main/install.ps1 | iex` (Windows).
* Start the server with `llmman serve` and pull a model with `llmman pull [model name]`, for example `llmman pull gemma4` or `llmman pull hf.co/unsloth/Qwen3.5-0.8B-GGUF`.
* Point the bot at it by setting `LLM_ENDPOINT = 127.0.0.1` and `LLM_PORT = 17434` in your `.env`, then set `MODEL` to a model you pulled. `/pull-model`, `/switch-model` and `/delete-model` work the same way.

## To Run Locally (without Docker)
* Run `npm install` to install the npm packages.
* Ensure that your [.env](../.env.sample) file's `LLM_ENDPOINT` is `127.0.0.1` to work properly.
    * You only need your `CLIENT_TOKEN`, `LLM_ENDPOINT`, `LLM_PORT`.
    * The LLM server ip and port should just use it's defaults by nature. If not, utilize `LLM_ENDPOINT = 127.0.0.1` and `LLM_PORT = 11434`.
    * The older `OLLAMA_IP` / `OLLAMA_PORT` names are still accepted as deprecated aliases.
* Now, you can run the bot by running `npm run client` which will build and run the decompiled typescript and run the setup for ollama.
    * **IMPORTANT**: This must be ran in the wsl/Linux instance to work properly! Using Command Prompt/Powershell/Git Bash/etc. will not work on Windows (at least in my experience).
    * Refer to the [resources](../README.md#resources) on what node version to use.
* If you are using wsl, open up a separate terminal/shell to startup the ollama service. Again, if you are running an older ollama, you must run `ollama serve` in that shell.
    * If you are on an actual Linux machine/VM there is no need for another terminal (unless you have an older ollama version).
    * If you do not have a model, you **can optionally** run `ollama pull [model name]` in wsl prior to application start. You are not required as it can be pulled from the Discord client.