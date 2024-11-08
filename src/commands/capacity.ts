import { ChannelType, Client, CommandInteraction, ApplicationCommandOptionType } from 'discord.js'
import { openConfig, SlashCommand } from '../utils/index.js'

export const Capacity: SlashCommand = {
    name: 'modify-capacity',
    description: 'number of messages bot will hold for context.',

    // set available user options to pass to the command
    options: [
        {
            name: 'context-capacity',
            description: 'a number to set capacity',
            type: ApplicationCommandOptionType.Number,
            required: true
        }
    ],

    // Query for message information and set the style
    run: async (client: Client, interaction: CommandInteraction) => {
        // fetch channel and message
        const channel = await client.channels.fetch(interaction.channelId)
        if (!channel || ![ChannelType.PrivateThread, ChannelType.PublicThread, ChannelType.GuildText].includes(channel.type)) return

        // set state of bot chat features
        openConfig(`${interaction.user.username}-config.json`, interaction.commandName, interaction.options.get('context-capacity')?.value)

        interaction.reply({
            content: `Message History Capacity has been set to \`${interaction.options.get('context-capacity')?.value}\``,
            ephemeral: true
        })
    }
}