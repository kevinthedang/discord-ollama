<div align="center">
    <p><a href="#"><a href="https://ollama.ai/"><img alt="ollama" src="./imgs/ollama-icon.png" width="200px" /></a><img alt="+" src="./imgs/grey-plus.png" width="100px" /></a><a href="https://discord.com/"><img alt="discord" src="./imgs/discord-icon.png" width="195px" /></a></p>
    <h1>Discord Ollama Integration</h1>
    <h3><a href="#"></a>Ollama as your Discord AI Assistant</h3>
    <p><a href="#"></a><a href="https://creativecommons.org/licenses/by/4.0/"><img alt="License" src="https://img.shields.io/badge/License-CC_BY_4.0-darkgreen.svg" /></a>
    <a href="#"></a><a href="https://github.com/kevinthedang/discord-ollama/releases/latest"><img alt="Release" src="https://img.shields.io/github/v/release/kevinthedang/discord-ollama?logo=github" /></a>
    <a href="#"></a><a href="https://github.com/kevinthedang/discord-ollama/actions/workflows/build.yml"><img alt="Build Status" src="https://github.com/kevinthedang/discord-ollama/actions/workflows/build.yml/badge.svg" /></a>
    <a href="#"></a><a href="https://github.com/kevinthedang/discord-ollama/actions/workflows/deploy.yml"><img alt="Deploy Status" src="https://github.com/kevinthedang/discord-ollama/actions/workflows/deploy.yml/badge.svg" /></a>
    <a href="#"></a><a href="https://github.com/kevinthedang/discord-ollama/actions/workflows/test.yml"><img alt="Testing Status" src="https://github.com/kevinthedang/discord-ollama/actions/workflows/test.yml/badge.svg" /></a>
    <a href="#"></a><a href="https://github.com/kevinthedang/discord-ollama/actions/workflows/coverage.yml"><img alt="Code Coverage" src="https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/kevinthedang/bc7b5dcfa16561ab02bb3df67a99b22d/raw/coverage.json"></a>
</div>

## About/Goals
Ollama is an AI model management tool that allows users to install and use custom large language models locally.  
The project aims to:
* [x] Create a Discord bot that will utilize Ollama and chat to chat with users! 
  * [x] User and Server Preferences
  * [x] Message Persistance
  * [x] Containerization with Docker
  * [x] Slash Commands Compatible
    * [ ] Summary Command
    * [ ] Model Info Command
    * [ ] List Models Command
    * [x] Pull Model Command
    * [x] Switch Model Command
    * [x] Delete Model Command
    * [x] Create Thread Command
    * [x] Create Private Thread Command
    * [x] Message Stream Command
    * [x] Change Message History Size Command
    * [x] Clear Channel History Command (User Only)
    * [x] Administrator Role Compatible
  * [x] Generated Token Length Handling for >2000
    * [x] Token Length Handling of any message size
  * [x] Multi-User Chat Generation - This was built in from Ollama `v0.2.1+`
  * [ ] Ollama Tool Support Implementation
  * [ ] Enhanced Channel Context Awareness
  * [ ] Improved User Replied Triggers

Further, Ollama provides the functionality to utilize custom models or provide context for the top-layer of any model available through the Ollama model library.
* [Customize a model](https://github.com/ollama/ollama#customize-a-model)
* [Modelfile Docs](https://github.com/ollama/ollama/blob/main/docs/modelfile.md)

## Documentation
These are guides to the features and capabilities of this app.
* [User Slash Commands](./docs/commands-guide.md)
* [Client Events](./docs/events-guide.md)

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
    * This project runs on `lts\jod` and above. 
    * This project requires the use of npm version `10.9.0` or above.
* [Ollama](https://ollama.com/)
    * [Ollama Docker Image](https://hub.docker.com/r/ollama/ollama)
* [Discord.js Docs](https://discord.js.org/docs/packages/discord.js/main)
* [Setting up Docker (Ubuntu 20.04)](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04)
    * [Setting up Nvidia Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html)

## Acknowledgement
* [Kevin Dang](https://github.com/kevinthedang)
* [Jonathan Smoley](https://github.com/JT2M0L3Y)

[discord-ollama](https://github.com/kevinthedang/discord-ollama) © 2023 by [Kevin Dang](https://github.com/kevinthedang) is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
