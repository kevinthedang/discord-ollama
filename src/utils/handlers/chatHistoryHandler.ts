import { TextChannel, ThreadChannel } from 'discord.js'
import { Configuration, Channel, UserMessage } from '../index.js'
import fs from 'fs'
import path from 'path'

/**
 * Method to check if a thread history file exists
 * 
 * @param channel parent thread of the requested thread (can be GuildText)
 * @returns true if channel does not exist, false otherwise
 */
async function checkChannelInfoExists(channel: TextChannel, user: string) {
    const doesExists: boolean = await new Promise((resolve) => {
        getChannelInfo(`${channel.id}-${user}.json`, (channelInfo) => {
            if (channelInfo?.messages)
                resolve(true)
            else
                resolve(false)
        })
    })
    return doesExists
}

/**
 * Method to clear channel history for requesting user
 * 
 * @param filename guild id string
 * @param channel the TextChannel in the Guild
 * @param user username of user
 * @returns nothing
 */
export async function clearChannelInfo(filename: string, channel: TextChannel, user: string): Promise<boolean> {
    const channelInfoExists: boolean = await checkChannelInfoExists(channel, user)

    // If thread does not exist, file can't be found
    if (!channelInfoExists) return false

    // Attempt to clear user channel history
    const fullFileName = `data/${filename}-${user}.json`
    const cleanedHistory: boolean = await new Promise((resolve) => {
        fs.readFile(fullFileName, 'utf8', (error, data) => {
            if (error)
                console.log(`[Error: openChannelInfo] Incorrect file format`)
            else {
                const object = JSON.parse(data)
                if (object['messages'].length === 0) // already empty, let user know
                    resolve(false)
                else {
                    object['messages'] = [] // cleared history
                    fs.writeFileSync(fullFileName, JSON.stringify(object, null, 2))
                    resolve(true)
                }
            }
        })
    })
    return cleanedHistory
}

/**
 * Method to open the channel history
 * 
 * @param filename name of the json file for the channel by user
 * @param channel the text channel info
 * @param user the user's name
 * @param messages their messages
 */
export async function openChannelInfo(this: any, filename: string, channel: TextChannel | ThreadChannel, user: string, messages: UserMessage[] = []): Promise<void> {
    const fullFileName = `data/${filename}-${user}.json`
    if (fs.existsSync(fullFileName)) {
        fs.readFile(fullFileName, 'utf8', (error, data) => {
            if (error)
                console.log(`[Error: openChannelInfo] Incorrect file format`)
            else {
                const object = JSON.parse(data)
                if (object['messages'].length === 0)
                    object['messages'] = messages as []
                else if (object['messages'].length !== 0 && messages.length !== 0)
                    object['messages'] = messages as []
                fs.writeFileSync(fullFileName, JSON.stringify(object, null, 2))
            }
        })
    } else { // file doesn't exist, create it
        const object: Configuration = JSON.parse(
            `{ 
                \"id\": \"${channel?.id}\", 
                \"name\": \"${channel?.name}\", 
                \"user\": \"${user}\", 
                \"messages\": []
            }`
        )

        const directory = path.dirname(fullFileName)
        if (!fs.existsSync(directory))
            fs.mkdirSync(directory, { recursive: true })

        // only creating it, no need to add anything
        fs.writeFileSync(fullFileName, JSON.stringify(object, null, 2))
        console.log(`[Util: ${this.name}] Created '${fullFileName}' in working directory`)
    }
}

/**
 * Method to get the channel information/history
 * 
 * @param filename name of the json file for the channel by user
 * @param callback function to handle resolving message history
 */
export async function getChannelInfo(filename: string, callback: (config: Channel | undefined) => void): Promise<void> {
    const fullFileName = `data/${filename}`
    if (fs.existsSync(fullFileName)) {
        fs.readFile(fullFileName, 'utf8', (error, data) => {
            if (error) {
                callback(undefined)
                return // something went wrong... stop
            }
            callback(JSON.parse(data))
        })
    } else {
        callback(undefined) // file not found
    }
}