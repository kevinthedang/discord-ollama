import { EmbedBuilder, Message } from 'discord.js'
import { ChatResponse, Ollama } from 'ollama'
import { ChatParams, UserMessage, streamResponse, blockResponse } from './index.js'
import { Queue } from '../queues/queue.js'

/**
 * Method to send replies as normal text on discord like any other user
 * @param message message sent by the user
 * @param tokens tokens to run query
 * @param msgHist message history between user and model
 */
export async function embedMessage(
    message: Message,
    ollama: Ollama,
    tokens: {
        channel: string,
        model: string
    },
    msgHist: Queue<UserMessage>,
    stream: boolean
): Promise<string> {
    // bot response
    let response: ChatResponse | AsyncGenerator<ChatResponse, any, unknown>
    let result: string = ''

    // initial message to client
    const botMessage = new EmbedBuilder()
    .setTitle(`Responding to ${message.author.tag}`)
    .setDescription('Generating Response . . .')
    .setColor('#00FF00')

    // send the message
    const sentMessage = await message.channel.send({ embeds: [botMessage] })

    // create params
    const params: ChatParams = {
        model: tokens.model,
        ollama: ollama,
        msgHist: msgHist.getItems()
    }

    try {
        // check if embed needs to stream
        if (stream) {
            response = await streamResponse(params)

            for await (const portion of response) {
                result += portion.message.content

                // exceeds handled length
                if (result.length > 6000) {
                    const errorEmbed = new EmbedBuilder()
                    .setTitle(`Responding to ${message.author.tag}`)
                    .setDescription(result || 'No Content Yet...')
                    .setColor('#00FF00')

                    // send error
                    message.channel.send({ embeds: [errorEmbed] })
                    break // cancel loop and stop
                }

                // new embed per token...
                const streamEmbed = new EmbedBuilder()
                .setTitle(`Responding to ${message.author.tag}`)
                .setDescription(result || 'No Content Yet...')
                .setColor('#00FF00')

                // edit the message
                sentMessage.edit({ embeds: [streamEmbed] })
            }
        } else {
            response = await blockResponse(params)
            result = response.message.content

            // long message, split into different embeds sadly.
            if (result.length > 6000) {
                const firstEmbed = new EmbedBuilder()
                .setTitle(`Responding to ${message.author.tag}`)
                .setDescription(result.slice(0, 6000) || 'No Content to Provide...')
                .setColor('#00FF00')

                // replace first embed
                sentMessage.edit({ embeds: [firstEmbed] })

                // take the rest out
                result = result.slice(6000)

                // handle the rest
                while (result.length > 6000) {
                    const whileEmbed = new EmbedBuilder()
                    .setTitle(`Responding to ${message.author.tag}`)
                    .setDescription(result.slice(0, 6000) || 'No Content to Provide...')
                    .setColor('#00FF00')

                    message.channel.send({ embeds: [whileEmbed] })
                    result = result.slice(6000)
                }

                const lastEmbed = new EmbedBuilder()
                .setTitle(`Responding to ${message.author.tag}`)
                .setDescription(result || 'No Content to Provide...')
                .setColor('#00FF00')

                // rest of the response
                message.channel.send({ embeds: [lastEmbed] })
            } else {
                // only need to create 1 embed, handles 6000 characters
                const newEmbed = new EmbedBuilder()
                .setTitle(`Responding to ${message.author.tag}`)
                .setDescription(result || 'No Content to Provide...')
                .setColor('#00FF00')

                // edit the message
                sentMessage.edit({ embeds: [newEmbed] })
            }
        }
    } catch(error: any) {
        console.log(`[Util: messageEmbed] Error creating message: ${error.message}`)
        const errorEmbed = new EmbedBuilder()
            .setTitle(`Responding to ${message.author.tag}`)
            .setDescription(`**Response generation failed.**\n\nReason: ${error.message}`)
            .setColor('#00FF00')
        
        // send back error
        sentMessage.edit({ embeds: [errorEmbed] })
    } 

    // Hope there is a response! undefined otherwie
    return result
}