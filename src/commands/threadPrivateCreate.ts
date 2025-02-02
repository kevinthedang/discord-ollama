import { ChannelType, Client, CommandInteraction, MessageFlags, TextChannel, ThreadChannel } from 'discord.js'
import { AdminCommand, openChannelInfo, SlashCommand } from '../utils/index.js'

export const PrivateThreadCreate: SlashCommand = {
    name: 'private-thread',
    description: 'creates a private thread and mentions user',

    // Query for server information
    run: async (client: Client, interaction: CommandInteraction) => {
        // fetch the channel
        const channel = await client.channels.fetch(interaction.channelId)
        if (!channel || !AdminCommand.includes(channel.type)) return

        const thread = await (channel as TextChannel).threads.create({
            name: `${client.user?.username}-private-support-${Date.now()}`,
            reason: `Support ticket ${Date.now()}`,
            type: ChannelType.PrivateThread
        })

        // Send a message in the thread
        thread.send(`Hello ${interaction.user}! \n\nIt's nice to meet you. Please talk to me by typing @${client.user?.username} with your prompt.`)

        // handle storing this chat channel
        // store: thread.id, thread.name
        openChannelInfo(thread.id, thread as ThreadChannel, interaction.user.tag)

        // user only reply
        return interaction.reply({
            content: `I can help you in <#${thread.id}>.`,
            flags: MessageFlags.Ephemeral
        })
    }
}