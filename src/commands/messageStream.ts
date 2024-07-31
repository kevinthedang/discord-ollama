import { ApplicationCommandOptionType, ChannelType, Client, CommandInteraction } from 'discord.js'
import { SlashCommand } from '../utils/commands.js'
import { openConfig } from '../utils/index.js'

export const MessageStream: SlashCommand = {
    name: 'message-stream',
    description: 'change preference on message streaming from ollama. WARNING: can be very slow.',

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
        if (!channel || channel.type !== (ChannelType.PrivateThread && ChannelType.PublicThread && ChannelType.GuildText)) return

        // save value to json and write to it
        openConfig(`${interaction.user.username}-config.json`, interaction.commandName, interaction.options.get('stream')?.value)

        interaction.reply({
            content: `Message streaming preferences set to: \`${interaction.options.get('stream')?.value}\``,
            ephemeral: true
        })
    }
}