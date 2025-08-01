import { TextChannel } from 'discord.js'
import { event, Events, normalMessage, UserMessage, clean, addToChannelContext } from '../utils/index.js'
import {
    getChannelInfo, getServerConfig, getUserConfig, openChannelInfo,
    openConfig, UserConfig, getAttachmentData, getTextFileAttachmentData
} from '../utils/index.js'

/** 
 * Max Message length for free users is 2000 characters (bot or not).
 * Bot supports infinite lengths for normal messages.
 * 
 * @param message the message received from the channel
 */
export default event(Events.MessageCreate, async ({ log, msgHist, channelHistory, ollama, client, defaultModel }, message) => {
    const clientId = client.user!!.id
    let cleanedMessage = clean(message.content, clientId)
    log(`Message \"${cleanedMessage}\" from ${message.author.tag} in channel/thread ${message.channelId}.`)

    // Do not respond if bot talks in the chat
    if (message.author.username === message.client.user.username) return

    // Save User Chat even if not for the bot
    let channelContextHistory: UserMessage[] = await new Promise((resolve) => {
        getChannelInfo(`${message.channelId}-context.json`, (channelInfo) => {
            if (channelInfo?.messages)
                resolve(channelInfo.messages)
            else {
                log(`Channel/Thread ${message.channel}-context does not exist. File will be created shortly...`)
                resolve([])
            }
        })
    })

    if (channelContextHistory.length === 0) {
        channelContextHistory = await new Promise((resolve) => {
            addToChannelContext(message.channelId,
                message.channel as TextChannel
            )
            getChannelInfo(`${message.channelId}-context.json`, (channelInfo) => {
                if (channelInfo?.messages)
                    resolve(channelInfo.messages)
                else {
                    log(`Channel/Thread ${message.channel}-context does not exist. File will be created shortly...`)
                }
            })
        })
    }

    // Set Channel History Queue
    channelHistory.setQueue(channelContextHistory)

    // get message attachment if exists
    const attachment = message.attachments.first()
    let messageAttachment: string[] = []

    if (attachment && attachment.name?.endsWith(".txt"))
        cleanedMessage += ' ' + await getTextFileAttachmentData(attachment)
    else if (attachment)
        messageAttachment = await getAttachmentData(attachment)

    while (channelHistory.size() >= channelHistory.capacity) channelHistory.dequeue()

    // push user response to channel history
    console.log
    channelHistory.enqueue({
        role: 'user',
        content: cleanedMessage,
        images: messageAttachment || []
    })

    // Store in Channel Context
    addToChannelContext(message.channelId,
        message.channel as TextChannel,
        channelHistory.getItems()
    )

    // Only respond if message mentions the bot
    if (!message.mentions.has(clientId)) return

    // default stream to false
    let shouldStream = false

    // Params for Preferences Fetching
    const maxRetries = 3
    const delay = 1000 // in millisecons

    try {
        // Retrieve Server/Guild Preferences
        let attempt = 0
        while (attempt < maxRetries) {
            try {
                await new Promise((resolve, reject) => {
                    getServerConfig(`${message.guildId}-config.json`, (config) => {
                        // check if config.json exists
                        if (config === undefined) {
                            // Allowing chat options to be available
                            openConfig(`${message.guildId}-config.json`, 'toggle-chat', true)
                            reject(new Error('Failed to locate or create Server Preferences\n\nPlease try chatting again...'))
                        }

                        // check if chat is disabled
                        else if (!config.options['toggle-chat'])
                            reject(new Error('Admin(s) have disabled chat features.\n\n Please contact your server\'s admin(s).'))
                        else
                            resolve(config)
                    })
                })
                break // successful
            } catch (error) {
                ++attempt
                if (attempt < maxRetries) {
                    log(`Attempt ${attempt} failed for Server Preferences. Retrying in ${delay}ms...`)
                    await new Promise(ret => setTimeout(ret, delay))
                } else
                    throw new Error(`Could not retrieve Server Preferences, please try chatting again...`)
            }
        }

        // Reset attempts for User preferences
        attempt = 0
        let userConfig: UserConfig | undefined

        while (attempt < maxRetries) {
            try {
                // Retrieve User Preferences
                userConfig = await new Promise((resolve, reject) => {
                    getUserConfig(`${message.author.username}-config.json`, (config) => {
                        if (config === undefined) {
                            openConfig(`${message.author.username}-config.json`, 'switch-model', defaultModel)
                            reject(new Error(`No User Preferences is set up.\n\nCreating new preferences file for ${message.author.username}\nPlease try chatting again.`))
                            return
                        }

                        // check if there is a set capacity in config
                        else if (typeof config.options['modify-capacity'] !== 'number')
                            log(`Capacity is undefined, using default capacity of ${msgHist.capacity}.`)
                        else if (config.options['modify-capacity'] === msgHist.capacity)
                            log(`Capacity matches config as ${msgHist.capacity}, no changes made.`)
                        else {
                            log(`New Capacity found. Setting Context Capacity to ${config.options['modify-capacity']}.`)
                            msgHist.capacity = config.options['modify-capacity']
                        }

                        // set stream state
                        shouldStream = config.options['message-stream'] as boolean || false

                        if (typeof config.options['switch-model'] !== 'string')
                            reject(new Error(`No Model was set. Please set a model by running \`/switch-model <model of choice>\`.\n\nIf you do not have any models. Run \`/pull-model <model name>\`.`))

                        resolve(config)
                    })
                })
                break // successful
            } catch (error) {
                ++attempt
                if (attempt < maxRetries) {
                    log(`Attempt ${attempt} failed for User Preferences. Retrying in ${delay}ms...`)
                    await new Promise(ret => setTimeout(ret, delay))
                } else
                    throw new Error(`Could not retrieve User Preferences, please try chatting again...`)
            }
        }

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

        if (!userConfig)
            throw new Error(`Failed to initialize User Preference for **${message.author.username}**.\n\nIt's likely you do not have a model set. Please use the \`switch-model\` command to do that.`)

        const model: string = userConfig.options['switch-model']

        // set up new queue
        msgHist.setQueue(chatMessages)

        // check if we can push, if not, remove oldest
        while (msgHist.size() >= msgHist.capacity) msgHist.dequeue()

        // push user response before ollama query
        msgHist.enqueue({
            role: 'user',
            content: cleanedMessage,
            images: messageAttachment || []
        })

        // response string for ollama to put its response
        const response: string = await normalMessage(message, ollama, model, msgHist, shouldStream)

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