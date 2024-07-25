import { ChannelType, Client, CommandInteraction, TextChannel } from 'discord.js'
import { SlashCommand } from '../utils/commands.js'
import { clearChannelInfo } from '../utils/index.js'

export const ClearUserChannelHistory: SlashCommand = {
    name: 'clear-user-channel-history',
    description: 'clears history for user running this command in current channel',

    // Clear channel history for intended user
    run: async (client: Client, interaction: CommandInteraction) => {
        // fetch current channel
        const channel = await client.channels.fetch(interaction.channelId)

        // if not an existing channel or a GuildText, fail command
        if (!channel || channel.type !== ChannelType.GuildText) return

        // clear channel info for user
        await clearChannelInfo(interaction.channelId, 
            interaction.channel as TextChannel, 
            interaction.user.username)
        
        interaction.reply({
            content: `Channel history in ${channel.name} cleared for ${interaction.user.username}`,
            ephemeral: true
        })
    }
}