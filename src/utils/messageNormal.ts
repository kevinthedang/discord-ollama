import { Message } from 'discord.js'
import { ChatResponse, Ollama } from 'ollama'
import { ChatParams, UserMessage } from './events.js'
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
    msgHist: Queue<UserMessage>,
    stream: boolean
) {
    // bot's respnse
    let response: ChatResponse | AsyncGenerator<ChatResponse, any, unknown>
    let result = ''

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

                    // resent current output, THIS WILL BE SLOW due to discord limits!
                    sentMessage.edit(result)
                }
            }
            else {
                response = await blockResponse(params)
                result = response.message.content

                // check if message length > discord max for normal messages
                if (result.length > 2000) {
                    sentMessage.edit(result.slice(0, 2000))
                    message.channel.send(result.slice(2000))
                } else // edit the 'generic' response to new message
                    sentMessage.edit(result)
            }            
        } catch(error: any) {
            console.log(`[Util: messageNormal] Error creating message: ${error.message}`)
            sentMessage.edit(`**Response generation failed.**\n\nReason: ${error.message}`)
        }
    })

    // Hope there is a response, force client to believe
    return result!!
}

/**
 * Method to query the Ollama client for async generation
 * @param params 
 * @returns Asyn
 */
async function streamResponse(params: ChatParams): Promise<AsyncGenerator<ChatResponse, any, unknown>> {
    return await params.ollama.chat({
        model: params.model,
        messages: params.msgHist,
        options: {
            num_thread: 8, // remove if optimization needed further
            mirostat: 1,
            mirostat_tau: 2.0,
            top_k: 70
        },
        stream: true
    })
}

/**
 * Method to query the Ollama client for a block response 
 * @param params parameters to query the client
 * @returns ChatResponse generated by the Ollama client
 */
async function blockResponse(params: ChatParams): Promise<ChatResponse> {
    return await params.ollama.chat({
        model: params.model,
        messages: params.msgHist,
        options: {
            num_thread: 8, // remove if optimization needed further
            mirostat: 1,
            mirostat_tau: 2.0,
            top_k: 70
        },
        stream: false
    })
}