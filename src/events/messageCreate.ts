import { embedMessage, event, Events, normalMessage, UserMessage } from '../utils/index.js'
import { getChannelInfo, getServerConfig, getThread, getUserConfig, openChannelInfo, openConfig, openThreadInfo, ServerConfig, UserConfig } from '../utils/jsonHandler.js'
import { clean } from '../utils/mentionClean.js'
import { TextChannel, ThreadChannel } from 'discord.js'

/** 
 * Max Message length for free users is 2000 characters (bot or not).
 * Bot supports infinite lengths for normal messages.
 * 
 * @param message the message received from the channel
 */
export default event(Events.MessageCreate, async ({ log, msgHist, tokens, ollama, client }, message) => {
    log(`Message \"${clean(message.content)}\" from ${message.author.tag} in channel/thread ${message.channelId}.`)

    // Do not respond if bot talks in the chat
    if (message.author.username === message.client.user.username) return

    // Only respond if message mentions the bot
    if (!message.mentions.has(tokens.clientUid)) return

    // default stream to false
    let shouldStream = false
 
    try {
        // Retrieve Server/Guild Preferences
        const serverConfig: ServerConfig = await new Promise((resolve, reject) => {
            getServerConfig(`${message.guildId}-config.json`, (config) => {
                // check if config.json exists
                if (config === undefined) {
                    // Allowing chat options to be available
                    openConfig(`${message.guildId}-config.json`, 'toggle-chat', true)

                    // default to channel scope chats
                    openConfig(`${message.guildId}-config.json`, 'channel-toggle', true)
                    reject(new Error('No Server Preferences is set up.\n\nCreating default server preferences file...\nPlease try chatting again.'))
                    return
                }

                // check if chat is disabled
                if (!config.options['toggle-chat']) {
                    reject(new Error('Admin(s) have disabled chat features.\n\n Please contact your server\'s admin(s).'))
                    return
                }

                // ensure channel json exists, if not create it
                if (config.options['channel-toggle']) {
                    openChannelInfo(message.channelId,
                        message.channel as TextChannel, 
                        message.author.username
                    )
                }

                resolve(config)
            })
        })

        // Retrieve User Preferences
        const userConfig: UserConfig = await new Promise((resolve, reject) => {
            getUserConfig(`${message.author.username}-config.json`, (config) => {
                if (config === undefined) {
                    openConfig(`${message.author.username}-config.json`, 'message-style', false)
                    reject(new Error('No User Preferences is set up.\n\nCreating preferences file with \`message-style\` set as \`false\` for regular messages.\nPlease try chatting again.'))
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

        

        // need new check for "open/active" threads/channels here!
        const chatMessages: UserMessage[] = await new Promise((resolve) => {
            // set new queue to modify
            if (serverConfig.options['channel-toggle']) {
                getChannelInfo(`${message.channelId}-${message.author.username}.json`, (channelInfo) => {
                    if (channelInfo?.messages)
                        resolve(channelInfo.messages)
                    else
                        log(`Channel ${message.channel}-${message.author.username} does not exist.`)
                })
            } else {
                getThread(`${message.channelId}.json`, (threadInfo) => {
                    if (threadInfo?.messages)
                        resolve(threadInfo.messages)
                    else
                        log(`Thread ${message.channelId} does not exist.`)
                }) 
            }
        })

        // response string for ollama to put its response
        let response: string

        // set up new queue
        msgHist.setQueue(chatMessages)

        // check if we can push, if not, remove oldest
        while (msgHist.size() >= msgHist.capacity) msgHist.dequeue()

        // push user response before ollama query
        msgHist.enqueue({
            role: 'user',
            content: clean(message.content)
        })
        
        // undefined or false, use normal, otherwise use embed
        if (userConfig.options['message-style'])
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

        // only update the json on success
        if (serverConfig.options['channel-toggle']) {
            openChannelInfo(message.channelId, 
                message.channel as TextChannel, 
                message.author.tag, 
                msgHist.getItems()
            )
        } else {
            openThreadInfo(`${message.channelId}.json`, 
                client.channels.fetch(message.channelId) as unknown as ThreadChannel, 
                msgHist.getItems()
            )
        }
    } catch (error: any) {
        msgHist.pop() // remove message because of failure
        message.reply(`**Error Occurred:**\n\n**Reason:** *${error.message}*`)
    }
})