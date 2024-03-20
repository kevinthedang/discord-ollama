import { ChatResponse } from 'ollama'
import { embedMessage, event, Events, normalMessage } from '../utils/index.js'
import { getConfig } from '../utils/jsonHandler.js'

/** 
 * Max Message length for free users is 2000 characters (bot or not).
 * @param message the message received from the channel
 */
export default event(Events.MessageCreate, async ({ log, msgHist, tokens, ollama }, message) => {
    log(`Message \"${message.content}\" from ${message.author.tag} in channel/thread ${message.channelId}.`)

    // Hard-coded channel to test output there only, in our case "ollama-endpoint"
    if (message.channelId != tokens.channel) return

    // Do not respond if bot talks in the chat
    if (message.author.tag === message.client.user.tag) return

    // Only respond if message mentions the bot
    if (!message.mentions.has(tokens.clientUid)) return

    // push user response
    msgHist.push({
        role: 'user',
        content: message.content
    })

    // Try to query and send embed
    getConfig('config.json', async (config) => {
        let response: ChatResponse

        if (config === undefined) return // do user preferences exist? then check style

        // undefined or false, use normal, otherwise use embed
        if (config.options.messageStyle)
            response = await embedMessage(message, ollama, tokens, msgHist)
        else
            response = await normalMessage(message, ollama, tokens, msgHist)

        // If something bad happened, remove user query and stop
        if (response == undefined) { msgHist.pop(); return }

        // successful query, save it as history
        msgHist.push({ 
            role: 'assistant', 
            content: response.message.content 
        })
    })
})