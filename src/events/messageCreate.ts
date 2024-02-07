import { embedMessage, event, Events } from '../utils/index.js'

/** 
 * Max Message length for free users is 2000 characters (bot or not).
 * @param message the message received from the channel
 */
export default event(Events.MessageCreate, async ({ log, msgHist, tokens, ollama }, message) => {
    log(`Message created \"${message.content}\" from ${message.author.tag}.`)

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
    const response = await embedMessage(message, ollama, tokens, msgHist)

    // Try to query and send message
    // log(normalMessage(message, tokens, msgHist))

    // If something bad happened, remove user query and stop
    if (response == undefined) { msgHist.pop(); return }

    // successful query, save it as history
    msgHist.push({
        role: 'assistant',
        content: response.message.content
    })
})