import { event, Events } from '../utils/index.js'
import { EmbedBuilder } from 'discord.js'
import ollama from 'ollama'
import Axios from 'axios'

/** 
 * Max Message length for free users is 2000 characters (bot or not).
 * @param message the message received from the channel
 */
export default event(Events.MessageCreate, async ({ log, msgHist }, message) => {
    log(`Message created \"${message.content}\" from ${message.author.tag}.`)

    // Hard-coded channel to test output there only, in our case "ollama-endpoint"
    if (message.channelId != '1188262786497785896') return

    // Do not respond if bot talks in the chat
    if (message.author.tag === message.client.user.tag) return

    // Only respond if message mentions the bot
    if (!message.mentions.has(tokens.botID)) return

    // push user response
    msgHist.push({
        role: 'user',
        content: message.content
    })

    const botMessage = new EmbedBuilder()
    .setTitle(`Response to ${message.author.tag}`)
    .setDescription('Generating Response . . .')
    .setColor('#00FF00')

    const sentMessage = await message.channel.send({ embeds: [botMessage] })

    const request = async () => {
        try {
            // change this when using an actual hosted server or use ollama.js
            const response = await ollama.chat({
                model: 'llama2',
                messages: msgHist,
                stream: false
            })

            const embed = new EmbedBuilder()
                .setTitle(`Response to ${message.author.tag}`)
                .setDescription(response.message.content)
                .setColor('#00FF00')

            sentMessage.edit({ embeds: [embed] })

            // push bot response
            msgHist.push({
                role: 'assistant',
                content: response.message.content
            })
        } catch (error) {
            message.edit(error as string)
            log(error)
        }
    }        

    // Attempt to call ollama's endpoint
    request()

    // Reply with something to prompt that ollama is working, version without embed
    message.reply("Generating Response . . .").then(sentMessage => {
        // Request made to API
        const request = async () => {
            try {
                // change this when using an actual hosted server or use ollama.js
                const response = await Axios.post('http://127.0.0.1:11434/api/chat', {
                    model: 'llama2',
                    messages: msgHist,
                    stream: false
                })
    
                sentMessage.edit(response.data.message.content)

                // push bot response
                // msgHist.push({
                //     role: 'assistant',
                //     content: response.data.message.content
                // })
            } catch (error) {
                message.edit(error as string)
                log(error)
            }
        }        

        // Attempt to call ollama's endpoint
        request()
    })
})