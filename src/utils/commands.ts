import { CommandInteraction, ChatInputApplicationCommandData, Client, ApplicationCommandOption } from 'discord.js'

/**
 * interface for how slash commands should be run
 */
export interface SlashCommand extends ChatInputApplicationCommandData {
    run: (
        client: Client,
        interaction: CommandInteraction,
        options?: ApplicationCommandOption[]
    ) => void
}

/**
 * register the command to discord for the channel
 * @param client the bot reference
 * @param commands commands to register to the bot
 */
export function registerCommands(client: Client, commands: SlashCommand[]): void {
    // ensure the bot is online before registering
    if (!client.application) return

    // fetch all the commands and delete them
    client.application.commands.fetch().then((fetchedCommands) => {
        for (const command of fetchedCommands.values()) {
            console.log(`Deleted command ${command.name}`)
            command.delete()
                .catch(console.error)
        }
    })

    // clear the cache of the commands
    client.application.commands.cache.clear()

    // iterate through all commands and register them with the bot
    for (const command of commands)
        client.application.commands
            .create(command)
            .then((c) => {
                console.log(`Registered command ${c.name}`)
                c.options?.forEach((o) => console.log(`  - ${o.name}`))
            })
}