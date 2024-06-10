import { ChannelType, Client, CommandInteraction, TextChannel } from 'discord.js'
import { SlashCommand } from '../utils/commands.js'
import { openThreadInfo } from '../utils/jsonHandler.js'

export const ThreadCreate: SlashCommand = {
    name: 'thread',
    description: 'creates a thread and mentions user',

    // Query for server information
    run: async (client: Client, interaction: CommandInteraction) => {
        // fetch the channel
        const channel = await client.channels.fetch(interaction.channelId)
        if (!channel || channel.type !== ChannelType.GuildText) return

        // check if channel is a valid "Ollama" thread
        // if (channel.id !== Keys.channel) 
        //     return interaction.reply({
        //         content: `${channel.client.user} cannot create **Chat Thread** with **${interaction.user.username}** here.\n\nChannel **${channel.name}** is not valid. Please ask an Admin for what channel or find **${Keys.channel}**.`,
        //         ephemeral: true
        //     })

        const thread = await (channel as TextChannel).threads.create({
            name: `${client.user?.username}-support-${Date.now()}`,
            reason: `Support ticket ${Date.now()}`
        })

        // Send a message in the thread
        thread.send(`**User:** ${interaction.user} \n**People in Coversation:** ${thread.memberCount}`)

        // handle storing this chat channel
        // store: thread.id, thread.name
        openThreadInfo(`data/${thread.id}.json`, thread)

        // user only reply
        return interaction.reply({
            content: `I can help you in thread **${thread.id}** below.`,
            ephemeral: true
        })
    }
}