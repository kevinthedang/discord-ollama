import { Message } from 'discord.js'
import ollama, { ChatResponse } from 'ollama'
import { UserMessage } from './events.js'

/**
 * Method to send replies as normal text on discord like any other user
 * @param message message sent by the user
 * @param tokens tokens to run query
 * @param msgHist message history between user and model
 */
export function normalMessage(
    message: Message, 
    tokens: {
        channel: string,
        model: string
    },
    msgHist: UserMessage[]
) {
    // bot's respnse
    let response: ChatResponse

    message.reply('Generating Response . . .').then(async sentMessage => {
        try {
            // Attempt to query model for message
            response = await ollama.chat({
                model: tokens.model,
                messages: msgHist,
                options: {
                    num_thread: 8, // remove if optimization needed further
                    mirostat: 1,
                    mirostat_tau: 2.0,
                    top_k: 70
                },
                stream: false
            })
            
            // edit the 'generic' response to new message
            sentMessage.edit(response.message.content)
        } catch(error: any) {
            sentMessage.edit(error.error)
        }
    })

    // Hope there is a response, force client to believe
    return response!!
}