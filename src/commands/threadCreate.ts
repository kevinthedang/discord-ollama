import { ChannelType, Client, CommandInteraction, TextChannel } from 'discord.js'
import { SlashCommand } from '../utils/commands.js'

export const ThreadCreate: SlashCommand = {
    name: 'thread',
    description: 'creates a thread and mentions user',

    // Query for server information
    run: async (client: Client, interaction: CommandInteraction) => {
        // fetch the channel
        const channel = await client.channels.fetch(interaction.channelId)
        if (!channel || channel.type !== ChannelType.GuildText) return

        const thread = await (channel as TextChannel).threads.create({
            name: `support-${Date.now()}`,
            reason: `Support ticket ${Date.now()}`
        })

        // Send a message in the thread
        thread.send(`**User:** ${interaction.user} \n**People in Coversation:** ${thread.memberCount}`)

        // user only reply
        return interaction.reply({
            content: `I can help you in the Thread below. \n**Thread ID:** ${thread.id}`,
            ephemeral: true
        })
    }
}