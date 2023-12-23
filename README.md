# Discord Ollama Integration [![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC_BY--NC_4.0-darkgreen.svg)](https://creativecommons.org/licenses/by-nc/4.0/) [![Release Badge](https://img.shields.io/github/v/release/kevinthedang/discord-ollama?logo=github)](https://github.com/kevinthedang/discord-ollama/releases/latest)
Ollama is an AI model management tool that allows users to install and use custom large language models locally. The goal is to create a discord bot that will utilize Ollama and chat with it on a Discord!

## To Run
* Clone this repo using `git clone https://github.com/kevinthedang/discord-ollama.git` or just use [GitHub Desktop](https://desktop.github.com/) to clone the repo.
* You can run the bot by running `npm run start` which will build and run the decompiled typescript.
    * Refer to the [resources](#resources) on what node version to use.

## Resources
* [NodeJS](https://nodejs.org/en)
    * This project uses `v20.10.0` (npm `10.2.5`). Consider using [nvm](https://github.com/nvm-sh/nvm) for multiple NodeJS versions.
        * To run dev in `ts-node`, using `v18.18.2` is recommended. **CAUTION**: `v18.19.0` or `lts/hydrogen` will not run properly.
        * To run dev with `tsx`, you can use `v20.10.0` or earlier.
    * This project supports any NodeJS version above `16.x.x` to only allow ESModules.
* [Ollama](https://ollama.ai/)
* [Docker Documentation](https://docs.docker.com/?_gl=1*nof6f8*_ga*MTQxNTc1MTYxOS4xNzAxNzI1ODAx*_ga_XJWPQMJYHQ*MTcwMjQxODUzOS4yLjEuMTcwMjQxOTgyMC41OS4wLjA.)
* [Discord Developer Portal](https://discord.com/developers/docs/intro)

## Acknowledgement
* [Kevin Dang](https://github.com/kevinthedang)

[discord-ollama](https://github.com/kevinthedang/discord-ollama) © 2023 by [Kevin Dang](https://github.com/kevinthedang) is licensed under [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/?ref=chooser-v1)