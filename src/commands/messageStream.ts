import { ApplicationCommandOptionType, ChannelType, Client, CommandInteraction } from 'discord.js'
import { SlashCommand } from '../utils/commands.js'

export const MessageStream: SlashCommand = {
    name: 'message-stream',
    description: 'change preference on message streaming from ollama. WARNING: can be very slow',

    // user option(s) for setting stream
    options: [
        {
            name: 'stream',
            description: 'enable or disable stream preference',
            type: ApplicationCommandOptionType.Boolean,
            required: true
        }
    ],

    // change preferences based on command
    run: async (client: Client, interaction: CommandInteraction) => {
        // verify channel
        const channel = await client.channels.fetch(interaction.channelId)
        if (!channel || channel.type !== ChannelType.GuildText) return

        // we need some sort of way to store these preferences! and by user, we can do this using interaction.user.username

        if (interaction.options.get('stream')?.value)
            console.log(`yay streaming for ${interaction.user.username}`)
        else
            console.log(`sad, no streaming for ${interaction.user.username}`)

        interaction.reply({
            content: `Message streaming preferences for embed set to: \`idk yet\``,
            ephemeral: true
        })
    }
}