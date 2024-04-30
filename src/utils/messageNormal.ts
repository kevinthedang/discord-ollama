import { Message } from 'discord.js'
import { ChatResponse, Ollama } from 'ollama'
import { ChatParams, UserMessage, streamResponse, blockResponse } from './index.js'
import { Queue } from '../queues/queue.js'
import { channel } from 'diagnostics_channel'

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
    msgHist: Queue<UserMessage>,
    stream: boolean
): Promise<string> {
    // bot's respnse
    let response: ChatResponse | AsyncGenerator<ChatResponse, any, unknown>
    let result: string = ''

    await message.channel.send('Generating Response . . .').then(async sentMessage => {
        try {
            const params: ChatParams = {
                model: tokens.model,
                ollama: ollama,
                msgHist: msgHist.getItems()
            } 

            // run query based on stream preference, true = stream, false = block
            if (stream) {
                response = await streamResponse(params)
                for await (const portion of response) {
                    // append token to message
                    result += portion.message.content

                    // exceeds handled length
                    if (result.length > 2000) {
                        message.channel.send(`Response length ${result.length} has exceeded Discord maximum.\n\nLong Stream messages not supported.`)
                        break // stop stream
                    }

                    // resent current output, THIS WILL BE SLOW due to discord limits!
                    sentMessage.edit(result || 'No Content Yet...')
                }
            }
            else {
                response = await blockResponse(params)
                result = response.message.content

                // check if message length > discord max for normal messages
                if (result.length > 2000) {
                    sentMessage.edit(result.slice(0, 2000))
                    result = result.slice(2000)

                    // handle for rest of message that is >2000
                    while (result.length > 2000) {
                        message.channel.send(result.slice(0, 2000))
                        result = result.slice(2000)
                    }

                    // last part of message
                    message.channel.send(result)
                } else // edit the 'generic' response to new message since <2000
                    sentMessage.edit(result)
            }            
        } catch(error: any) {
            console.log(`[Util: messageNormal] Error creating message: ${error.message}`)
            sentMessage.edit(`**Response generation failed.**\n\nReason: ${error.message}`)
        }
    })

    // return the string representation of ollama query response
    return result
}
