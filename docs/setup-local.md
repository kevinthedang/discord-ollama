## Ollama Setup
* Go to Ollama's [Linux download page](https://ollama.ai/download/linux) and run the simple curl command they provide. The command should be `curl https://ollama.ai/install.sh | sh`.
* Now the the following commands in separate terminals to test out how it works!
    * In terminal 1 -> `ollama serve` to setup ollama
    * In terminal 2 -> `ollama run [model name]`, for example `ollama run llama2`
        * The models can vary as you can create your own model. You can also view ollama's [library](https://ollama.ai/library) of models.
    * If there are any issues running ollama because of missing LLMs, run `ollama pull [model name]` as it will pull the model if Ollama has it in their library.
    * This can also be done in [wsl](https://learn.microsoft.com/en-us/windows/wsl/install) for Windows machines.
* You can now interact with the model you just ran (it might take a second to startup).
    * Response time varies with processing power!

## To Run Locally (without Docker)
* Run `npm install` to install the npm packages.
* Ensure that your [.env](../.env.sample) file's `OLLAMA_IP` is `127.0.0.1` to work properly.
* Now, you can run the bot by running `npm run client` which will build and run the decompiled typescript and run the setup for ollama.
    * **IMPORTANT**: This must be ran in the wsl/Linux instance to work properly! Using Command Prompt/Powershell/Git Bash/etc. will not work on Windows (at least in my experience).
    * Refer to the [resources](../README.md#resources) on what node version to use.
* Open up a separate terminal/shell (you will need wsl for this if on windows) and run `ollama serve` to startup ollama.
    * If you do not have a model, you will need to run `ollama pull [model name]` in a separate terminal to get it.