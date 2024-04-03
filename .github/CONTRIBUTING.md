<!-- 
    Author: Kevin Dang 
    Date: 1-30-2024    
-->
## Run the Bot
* Refer to all sections below before running the bot.
* You should now have `Ollama`, `NodeJS`, ran `npm install`.
* You will also need a discord bot to run. Refer to the [developer portal](https://discord.com/developers/) to learn how to set one up and invite it to your server. If that does not help then look up a YouTube video like this [one](https://www.youtube.com/watch?v=KZ3tIGHU314&ab_channel=UnderCtrl).
* Now run `npm run start` to run the client and ollama at the same time (this must be one in wsl or a Linux distro)


## Set up (Development-side)
* Pull the repository using `https://github.com/kevinthedang/discord-ollama.git`.
* Refer to `Ollama Setup` in the readme to set up Ollama.
  * This must be set up in a Linux environment or wsl2.
* Install NodeJS `v18.18.2`
  * You can check out `Resources` and `To Run` in the readme for a bit of help.
  * You can also reference [NodeJS Setup](#nodejs-setup)
* When you have the project pulled from github, open up a terminal and run `npm i` or `npm install` to get all of the packages for the project.
* In some kind of terminal (`git bash` is good) to run the client. You can run Ollama but opening up wsl2 and typing `ollama serve`.
  * Refer to `Ollama Setup` if there are any issues.

## Environment
* You will need two environment files:
  * `.env`: for running the bot
    * Please refer to `.env.sample` for all environment variables to include
  * `.env.dev.local`: also runs the bot, but with development variables
    * Currently there are no differences between the two, but when needed, you may add environment variables as needed.

## NodeJS Setup
* Install [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) using `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash`
  * Ensure this in the profile of what shell you use (for `git bash` it would be `.bash_profile` found in your home directory)
* Ensure it has been install correctly by running `nvm -v`
* Now, install `v18.18.2` by running `nvm install 18.18.2`
* Then run `nvm use 18.18.2 | nvm alias default 18.18.2` or you can run them separately if that does not work. This just sets the default NodeJS to `v18.18.2` when launching a shell.
