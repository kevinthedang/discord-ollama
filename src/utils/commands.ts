import { ChatInputCommandInteraction, ChatInputApplicationCommandData, Client, ApplicationCommandOption } from 'discord.js'

/**
 * interface for how slash commands should be run
 */
export interface SlashCommand extends ChatInputApplicationCommandData {
    run: (
        client: Client,
        interaction: ChatInputCommandInteraction,
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

    // map commands into an array of names, used to checking registered commands
    const commandsToRegister: string[] = commands.map(command => command.name)

    // fetch all the commands and delete them
    client.application.commands.fetch().then((fetchedCommands) => {
        for (const command of fetchedCommands.values()) {
            if (!commandsToRegister.includes(command.name)) {
                command.delete().catch(console.error)
                console.log(`[Command: ${command.name}] Removed from Discord`)
            }
        }
    })

    // clear the cache of the commands
    client.application.commands.cache.clear()

    // iterate through all commands and register them with the bot
    for (const command of commands)
        client.application.commands
            .create(command)
            .then((c) => {
                console.log(`[Command: ${c.name}] Registered on Discord`)
                c.options?.forEach((o) => console.log(`  - ${o.name}`))
            })
}