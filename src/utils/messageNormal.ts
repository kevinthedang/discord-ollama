import { Message } from 'discord.js'
import { ChatResponse, Ollama } from 'ollama'
import { UserMessage } from './events.js'
import { Queue } from '../queues/queue.js'

/**
 * Method to send replies as normal text on discord like any other user
 * @param message message sent by the user
 * @param tokens tokens to run query
 * @param msgHist message history between user and model
 */
export async function normalMessage(
    message: Message,
    ollama: Ollama,
    tokens: {
        channel: string,
        model: string
    },
    msgHist: Queue<UserMessage>
) {
    // bot's respnse
    let response: ChatResponse

    await message.channel.send('Generating Response . . .').then(async sentMessage => {
        try {
            // Attempt to query model for message
            response = await ollama.chat({
                model: tokens.model,
                messages: msgHist.getItems(),
                options: {
                    num_thread: 8, // remove if optimization needed further
                    mirostat: 1,
                    mirostat_tau: 2.0,
                    top_k: 70
                },
                stream: false
            })

            // check if message length > discord max for normal messages
            if (response.message.content.length > 2000) {
                sentMessage.edit(response.message.content.slice(0, 2000))
                message.channel.send(response.message.content.slice(2000))
            } else // edit the 'generic' response to new message
                sentMessage.edit(response.message.content)            
        } catch(error: any) {
            console.log(`[Util: messageNormal] Error creating message: ${error.message}`)
            sentMessage.edit(`**Response generation failed.**\n\nReason: ${error.message}`)
        }
    })

    // Hope there is a response, force client to believe
    return response!!
}