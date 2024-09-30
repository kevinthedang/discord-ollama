import { ChannelType, Client, CommandInteraction, ApplicationCommandOptionType } from 'discord.js'
import { openConfig, SlashCommand } from '../utils/index.js'

export const MessageStyle: SlashCommand = {
    name: 'message-style',
    description: 'sets the message style to embed or normal',

    // set available user options to pass to the command
    options: [
        {
            name: 'embed',
            description: 'toggle embedded or normal message',
            type: ApplicationCommandOptionType.Boolean,
            required: true
        }
    ],

    // Query for message information and set the style
    run: async (client: Client, interaction: CommandInteraction) => {
        // fetch channel and message
        const channel = await client.channels.fetch(interaction.channelId)
        if (!channel || channel.type !== (ChannelType.PrivateThread && ChannelType.PublicThread && ChannelType.GuildText)) return

        // set the message style
        openConfig(`${interaction.user.username}-config.json`, interaction.commandName, interaction.options.get('embed')?.value)

        interaction.reply({
            content: `Message style preferences for embed set to: \`${interaction.options.get('embed')?.value}\``,
            ephemeral: true
        })
    }
}