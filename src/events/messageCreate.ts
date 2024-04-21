import { ChatResponse } from 'ollama'
import { embedMessage, event, Events, normalMessage } from '../utils/index.js'
import { Configuration, getConfig, openFile } from '../utils/jsonHandler.js'
import { clean } from '../utils/mentionClean.js'

/** 
 * Max Message length for free users is 2000 characters (bot or not).
 * @param message the message received from the channel
 */
export default event(Events.MessageCreate, async ({ log, msgHist, tokens, ollama }, message) => {
    log(`Message \"${clean(message.content)}\" from ${message.author.tag} in channel/thread ${message.channelId}.`)

    // Hard-coded channel to test output there only, in our case "ollama-endpoint"
    if (message.channelId != tokens.channel) return

    // Do not respond if bot talks in the chat
    if (message.author.tag === message.client.user.tag) return

    // Only respond if message mentions the bot
    if (!message.mentions.has(tokens.clientUid)) return

    let shouldStream = false

    // Try to query and send embed     
    try {
        const config: Configuration = await new Promise((resolve, reject) => {
            getConfig('config.json', (config) => {
                // check if config.json exists
                if (config === undefined) {
                    reject(new Error('No Configuration is set up.\n\nCreating \`config.json\` with \`message-style\` set as \`false\` for regular messages.\nPlease try chatting again.'))
                    return
                }

                // check if chat is disabled
                if (!config.options['toggle-chat']) {
                    reject(new Error('Admin(s) have disabled chat features.\n\n Please contact your server\'s admin(s).'))
                    return
                }

                // check if there is a set capacity in config
                if (typeof config.options['modify-capacity'] !== 'number')
                    log(`Capacity is undefined, using default capacity of ${msgHist.capacity}.`)
                else if (config.options['modify-capacity'] === msgHist.capacity)
                    log(`Capacity matches config as ${msgHist.capacity}, no changes made.`)
                else {
                    log(`New Capacity found. Setting Context Capacity to ${config.options['modify-capacity']}.`)
                    msgHist.capacity = config.options['modify-capacity']
                }

                // set stream state
                shouldStream = config.options['message-stream'] as boolean || false

                resolve(config)
            })
        })

        let response: string    

        // check if we can push, if not, remove oldest
        while (msgHist.size() >= msgHist.capacity) msgHist.dequeue()

        // push user response before ollama query
        msgHist.enqueue({
            role: 'user',
            content: clean(message.content)
        })
        
        // undefined or false, use normal, otherwise use embed
        if (config.options['message-style'])
            response = await embedMessage(message, ollama, tokens, msgHist, shouldStream)
        else
            response = await normalMessage(message, ollama, tokens, msgHist, shouldStream)

        // If something bad happened, remove user query and stop
        if (response == undefined) { msgHist.pop(); return }

        // if queue is full, remove the oldest message
        while (msgHist.size() >= msgHist.capacity) msgHist.dequeue()

        // successful query, save it in context history
        msgHist.enqueue({ 
            role: 'assistant', 
            content: response
        })
    } catch (error: any) {
        msgHist.pop() // remove message because of failure
        openFile('config.json', 'message-style', false)
        message.reply(`**Error Occurred:**\n\n**Reason:** *${error.message}*`)
    }
})