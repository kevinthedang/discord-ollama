import { Client, CommandInteraction, Message, MessageFlags, SendableChannels } from "discord.js";
import { accessChannelContext, normalMessage, SlashCommand, summarizeContextHistory, UserCommand, UserMessage } from "../utils/index.js";
import { ollama } from "../client.js"

export const Summary: SlashCommand = {
    name: 'summary',
    description: 'provides a summary of the chat history.',

    // Generate Summary from additional context
    run: async (client: Client, interaction: CommandInteraction) => {
        // fetch channel
        const channel = await client.channels.fetch(interaction.channelId)
        if (!channel || !UserCommand.includes(channel.type)) return

        // Defer
        await interaction.deferReply({ flags: MessageFlags.Ephemeral })

        // create summary using context
        let channelContext: UserMessage[] = await new Promise((resolve) => {
            accessChannelContext(interaction.channelId, (additionalContext) => {
                if (additionalContext?.messages)
                    resolve(additionalContext.messages)
                else 
                    resolve([])
            })
        })

        if (channelContext.length === 0) {
            interaction.reply({
                content: `There are no recent chat messages in this channel.`,
                flags: MessageFlags.Ephemeral
            })
            return
        }

        // Push summarize prompt
        channelContext.push({
            role: "user",
            content: "Please Summarize everything from the prior messages, provide in bullet point fashion on what people have said prior. For example: \"Someone mentioned/talked about ...\"",
            images: []
        })

        // todo: instead of a default of codellama, we can user default model somehow. Look into later.
        const response: string = await summarizeContextHistory(ollama, "codellama", channelContext)

        console.log(response)

        interaction.editReply({ content: response })
    }
}