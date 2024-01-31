import { CommandInteraction, ChatInputApplicationCommandData, Client } from 'discord.js'

/**
 * interface for how slash commands should be run
 */
export interface SlashCommand extends ChatInputApplicationCommandData {
    run: (client: Client, interaction: CommandInteraction) => void
}

/**
 * register the command to discord for the channel
 * @param client the bot reference
 * @param commands commands to register to the bot
 */
export function registerCommands(client: Client, commands: SlashCommand[]): void {
    // ensure the bot is online before registering
    if (!client.application) return

    // iterate through all commands and register them with the bot
    for (const command of commands)
        client.application.commands.create(command)
}