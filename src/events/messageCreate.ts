import { embedMessage, event, Events, normalMessage, UserMessage } from '../utils/index.js'
import { getChannelInfo, getServerConfig, getUserConfig, openChannelInfo, openConfig, UserConfig, getAttachmentData } from '../utils/index.js'
import { clean } from '../utils/mentionClean.js'
import { TextChannel } from 'discord.js'

/** 
 * Max Message length for free users is 2000 characters (bot or not).
 * Bot supports infinite lengths for normal messages.
 * 
 * @param message the message received from the channel
 */
export default event(Events.MessageCreate, async ({ log, msgHist, tokens, ollama }, message) => {
    log(`Message \"${clean(message.content)}\" from ${message.author.tag} in channel/thread ${message.channelId}.`)

    // Do not respond if bot talks in the chat
    if (message.author.username === message.client.user.username) return

    // Only respond if message mentions the bot
    if (!message.mentions.has(tokens.clientUid)) return

    // default stream to false
    let shouldStream = false
 
    try {
        // Retrieve Server/Guild Preferences
        await new Promise((resolve, reject) => {
            getServerConfig(`${message.guildId}-config.json`, (config) => {
                // check if config.json exists
                if (config === undefined) {
                    // Allowing chat options to be available
                    openConfig(`${message.guildId}-config.json`, 'toggle-chat', true)
                    reject(new Error('No Server Preferences is set up.\n\nCreating default server preferences file...\nPlease try chatting again.'))
                    return
                }

                // check if chat is disabled
                if (!config.options['toggle-chat']) {
                    reject(new Error('Admin(s) have disabled chat features.\n\n Please contact your server\'s admin(s).'))
                    return
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
        let chatMessages: UserMessage[] = await new Promise((resolve) => {
            // set new queue to modify
            getChannelInfo(`${message.channelId}-${message.author.username}.json`, (channelInfo) => {
                if (channelInfo?.messages)
                    resolve(channelInfo.messages)
                else {
                    log(`Channel/Thread ${message.channel}-${message.author.username} does not exist. File will be created shortly...`)
                    resolve([])
                }
            })
        })

        if (chatMessages.length === 0) {
            chatMessages = await new Promise((resolve, reject) => {
                openChannelInfo(message.channelId, 
                    message.channel as TextChannel,
                    message.author.tag
                )
                getChannelInfo(`${message.channelId}-${message.author.username}.json`, (channelInfo) => {
                    if (channelInfo?.messages)
                        resolve(channelInfo.messages)
                    else {
                        log(`Channel/Thread ${message.channel}-${message.author.username} does not exist. File will be created shortly...`)
                        reject(new Error(`Failed to find ${message.author.username}'s history. Try chatting again.`))
                    }
                })
            })
        }

        // response string for ollama to put its response
        let response: string

        // get message attachment if exists
        const messageAttachment: string[] = await getAttachmentData(message.attachments.first())
        log(messageAttachment)

        // set up new queue
        msgHist.setQueue(chatMessages)

        // check if we can push, if not, remove oldest
        while (msgHist.size() >= msgHist.capacity) msgHist.dequeue()

        // push user response before ollama query
        msgHist.enqueue({
            role: 'user',
            content: clean(message.content),
            images: messageAttachment || []
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
            content: response,
            images: messageAttachment || []
        })

        // only update the json on success
        openChannelInfo(message.channelId, 
            message.channel as TextChannel,
            message.author.tag, 
            msgHist.getItems()
        )
    } catch (error: any) {
        msgHist.pop() // remove message because of failure
        message.reply(`**Error Occurred:**\n\n**Reason:** *${error.message}*`)
    }
})