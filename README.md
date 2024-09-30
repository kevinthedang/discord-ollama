<div align="center">
    <p><a href="#"><a href="https://ollama.ai/"><img alt="ollama" src="./imgs/ollama-icon.png" width="200px" /></a><img alt="+" src="./imgs/grey-plus.png" width="100px" /></a><a href="https://discord.com/"><img alt="discord" src="./imgs/discord-icon.png" width="195px" /></a></p>
    <h1>Discord Ollama Integration</h1>
    <h3><a href="#"></a>Ollama as your Discord AI Assistant</h3>
    <p><a href="#"></a><a href="https://creativecommons.org/licenses/by/4.0/"><img alt="License" src="https://img.shields.io/badge/License-CC_BY_4.0-darkgreen.svg" /></a>
    <a href="#"></a><a href="https://github.com/kevinthedang/discord-ollama/releases/latest"><img alt="Release" src="https://img.shields.io/github/v/release/kevinthedang/discord-ollama?logo=github" /></a>
    <a href="#"></a><a href="https://github.com/kevinthedang/discord-ollama/actions/workflows/build.yml"><img alt="Build Status" src="https://github.com/kevinthedang/discord-ollama/actions/workflows/build.yml/badge.svg" /></a>
    <a href="#"></a><a href="https://github.com/kevinthedang/discord-ollama/actions/workflows/release.yml"><img alt="Release Status" src="https://github.com/kevinthedang/discord-ollama/actions/workflows/release.yml/badge.svg" /></a>
    <a href="#"></a><a href="https://github.com/kevinthedang/discord-ollama/actions/workflows/test.yml"><img alt="Testing Status" src="https://github.com/kevinthedang/discord-ollama/actions/workflows/test.yml/badge.svg" /></a>
    <a href="#"></a><a href="https://githubh.com/kevinthedang/discord-ollama/actions/coverage.yml"><img alt="Code Coverage" src="https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/JT2M0L3Y/44bd608fa1a3864c9c27a5d79235f3b8/raw/coverage.json"></a>
</div>

## About/Goals
Ollama is an AI model management tool that allows users to install and use custom large language models locally.  
The project aims to:
* [x] Create a Discord bot that will utilize Ollama and chat to chat with users! 
  * [x] User Preferences on Chat
  * [x] Message Persistance on Channels and Threads
    * [x] Threads
    * [x] Channels
  * [x] Containerization with Docker
  * [x] Slash Commands Compatible
  * [x] Generated Token Length Handling for >2000
    * [x] Token Length Handling of any message size
  * [x] User vs. Server Preferences
  * [ ] Redis Caching
  * [x] Administrator Role Compatible
  * [x] Multi-User Chat Generation (Multiple users chatting at the same time) - This was built into from Ollama `v0.2.1+`
  * [ ] Automatic and Manual model pulling through the Discord client
* [ ] Allow others to create their own models personalized for their own servers!
  * [ ] Documentation on creating your own LLM
  * [ ] Documentation on web scrapping and cleaning

## Environment Setup
* Clone this repo using `git clone https://github.com/kevinthedang/discord-ollama.git` or just use [GitHub Desktop](https://desktop.github.com/) to clone the repo.
* You will need a `.env` file in the root of the project directory with the bot's token. There is a `.env.sample` is provided for you as a reference for what environment variables.
    * For example, `CLIENT_TOKEN = [Bot Token]`
* Please refer to the docs for bot setup.
    * [Creating a Discord App](./docs/setup-discord-app.md)
    * [Local Machine Setup](./docs/setup-local.md)
    * [Docker Setup for Servers and Local Machines](./docs/setup-docker.md)
        * Nvidia is recommended for now, but support for other GPUs should be development.
        * Local use is not recommended.
## Resources
* [NodeJS](https://nodejs.org/en)
    * This project runs on `lts\hydrogen`. 
    * This project supports any NodeJS version above `16.x.x` to only allow ESModules.
* [Ollama](https://ollama.com/)
    * [Ollama Docker Image](https://hub.docker.com/r/ollama/ollama)
* [Discord.js Docs](https://discord.js.org/docs/packages/discord.js/main)
* [Setting up Docker (Ubuntu 20.04)](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04)
    * [Setting up Nvidia Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html)

## Acknowledgement
* [Kevin Dang](https://github.com/kevinthedang)
* [Jonathan Smoley](https://github.com/JT2M0L3Y)

[discord-ollama](https://github.com/kevinthedang/discord-ollama) © 2023 by [Kevin Dang](https://github.com/kevinthedang) is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)