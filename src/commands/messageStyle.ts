import { ChannelType, Client, CommandInteraction, ApplicationCommandOptionType } from 'discord.js'
import { SlashCommand } from '../utils/commands.js'

// 'global' variable to store the message style
export var embedStyle = true

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
        if (!channel || channel.type !== ChannelType.GuildText) return

        // set the message style
        if (interaction.options.get('embed')?.value)
            embedStyle = true
        else
            embedStyle = false

        interaction.reply({
            content: `Message style preferences for embed set to: \`${embedStyle}\``,
            ephemeral: true
        })
    }
}