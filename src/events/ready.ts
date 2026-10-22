import { ActivityType } from 'discord.js'
import { event, Events, registerCommands } from '../utils/index.js'
import commands from '../commands/index.js'

// Log when the bot successfully logs in and export it
export default event(Events.ClientReady, ({ logger }, client) => {
    // Register the commands associated with the bot upon loggin in
    registerCommands(client, commands, logger)

    // set status of the bot
    client.user.setActivity({
        name: 'Powered by Ollama',
        type: ActivityType.Custom
    })

    logger.info({ username: client.user.username }, 'Client ready')
})