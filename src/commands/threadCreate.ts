import { ChannelType, Client, CommandInteraction, TextChannel } from 'discord.js'
import { SlashCommand } from '../utils/commands.js'
import { openThreadInfo } from '../utils/index.js'

export const ThreadCreate: SlashCommand = {
    name: 'thread',
    description: 'creates a thread and mentions user',

    // Query for server information
    run: async (client: Client, interaction: CommandInteraction) => {
        // fetch the channel
        const channel = await client.channels.fetch(interaction.channelId)
        if (!channel || channel.type !== ChannelType.GuildText) return

        const thread = await (channel as TextChannel).threads.create({
            name: `${client.user?.username}-support-${Date.now()}`,
            reason: `Support ticket ${Date.now()}`,
            type: ChannelType.PublicThread
        })

        // Send a message in the thread
        thread.send(`Hello ${interaction.user} and others! \n\nIt's nice to meet you. Please talk to me by typing **@${client.user?.username}** with your prompt.`)

        // handle storing this chat channel
        // store: thread.id, thread.name
        openThreadInfo(`${thread.id}.json`, thread)

        // user only reply
        return interaction.reply({
            content: `I can help you in thread **${thread.id}** below.`,
            ephemeral: true
        })
    }
}