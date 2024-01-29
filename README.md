# Discord Ollama Integration [![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC_BY--NC_4.0-darkgreen.svg)](https://creativecommons.org/licenses/by-nc/4.0/) [![Release Badge](https://img.shields.io/github/v/release/kevinthedang/discord-ollama?logo=github)](https://github.com/kevinthedang/discord-ollama/releases/latest)
Ollama is an AI model management tool that allows users to install and use custom large language models locally. The goal is to create a discord bot that will utilize Ollama and chat with it on a Discord!

## Ollama Setup
* Go to Ollama's [Linux download page](https://ollama.ai/download/linux) and run the simple curl command they provide. The command should be `curl https://ollama.ai/install.sh | sh`.
* Now the the following commands in separate terminals to test out how it works!
    * In terminal 1 -> `ollama serve` to setup ollama
    * In terminal 2 -> `ollama run [model name]`, for example `ollama run llama2`
        * The models can vary as you can create your own model. You can also view ollama's [library](https://ollama.ai/library) of models.
    * This can also be done in [wsl](https://learn.microsoft.com/en-us/windows/wsl/install) for Windows machines.
* You can now interact with the model you just ran (it might take a second to startup).
    * Response time varies with processing power!

## To Run
* Clone this repo using `git clone https://github.com/kevinthedang/discord-ollama.git` or just use [GitHub Desktop](https://desktop.github.com/) to clone the repo.
* Run `npm install` to install the npm packages.
* You will need a `.env` file in the root of the project directory with the bot's token. 
    * For example, `CLIENT_TOKEN = [Bot Token]`
* Now, you can run the bot by running `npm run start` which will build and run the decompiled typescript and run the setup for ollama.
    * **IMPORTANT**: This must be ran in the wsl/Linux instance to work properly! Using Command Prompt/Powershell/Git Bash/etc. will not work on Windows (at least in my experience).
    * Refer to the [resources](#resources) on what node version to use.

## Resources
* [NodeJS](https://nodejs.org/en)
    * This project uses `v20.10.0` (npm `10.2.5`). Consider using [nvm](https://github.com/nvm-sh/nvm) for multiple NodeJS versions.
        * To run dev in `ts-node`, using `v18.18.2` is recommended. **CAUTION**: `v18.19.0` or `lts/hydrogen` will not run properly.
        * To run dev with `tsx`, you can use `v20.10.0` or earlier.
    * This project supports any NodeJS version above `16.x.x` to only allow ESModules.
* [Ollama](https://ollama.ai/)
* [Discord Developer Portal](https://discord.com/developers/docs/intro)
* [Discord.js Docs](https://discord.js.org/docs/packages/discord.js/main)

## Acknowledgement
* [Kevin Dang](https://github.com/kevinthedang)
* [Jonathan Smoley](https://github.com/JT2M0L3Y)

[discord-ollama](https://github.com/kevinthedang/discord-ollama) © 2023 by [Kevin Dang](https://github.com/kevinthedang) is licensed under [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/?ref=chooser-v1)