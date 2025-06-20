import { Client, ChatInputCommandInteraction, ApplicationCommandOptionType, MessageFlags } from 'discord.js'
import { openConfig, SlashCommand, UserCommand } from '../utils/index.js'

export const Capacity: SlashCommand = {
    name: 'modify-capacity',
    description: 'maximum amount messages bot will hold for context.',

    // set available user options to pass to the command
    options: [
        {
            name: 'context-capacity',
            description: 'number of allowed messages to remember',
            type: ApplicationCommandOptionType.Number,
            required: true
        }
    ],

    // Query for message information and set the style
    run: async (client: Client, interaction: ChatInputCommandInteraction) => {
        // fetch channel and message
        const channel = await client.channels.fetch(interaction.channelId)
        if (!channel || !UserCommand.includes(channel.type)) return

        // set state of bot chat features
        openConfig(`${interaction.user.username}-config.json`, interaction.commandName,
            interaction.options.getNumber('context-capacity')
        )

        interaction.reply({
            content: `Max message history is now set to \`${interaction.options.get('context-capacity')?.value}\``,
            flags: MessageFlags.Ephemeral
        })
    }
}