import { TextChannel, ThreadChannel } from 'discord.js'
import { Configuration, Thread, Channel, UserMessage } from '../index.js'
import fs from 'fs'
import path from 'path'

/**
 * Method to open/create and modify a json file containing thread information
 * 
 * @param filename name of the thread file
 * @param thread the thread with all of the interactions
 * @param message message contents and from who
 */
export function openThreadInfo(filename: string, thread: ThreadChannel, messages: UserMessage[] = []) {
    // check if the file exists, if not then make the config file
    const fullFileName = `data/${filename}`
    if (fs.existsSync(fullFileName)) {
        fs.readFile(fullFileName, 'utf8', (error, data) => {
            if (error)
                console.log(`[Error: openThreadInfo] Incorrect file format`)
            else {
                const object = JSON.parse(data)
                object['messages'] = messages as []
                fs.writeFileSync(fullFileName, JSON.stringify(object, null, 2))
            }
        })
    } else { // file doesn't exist, create it
        const object: Configuration = JSON.parse(`{ \"id\": \"${thread?.id}\", \"name\": \"${thread?.name}\", \"messages\": []}`)

        const directory = path.dirname(fullFileName)
        if (!fs.existsSync(directory))
            fs.mkdirSync(directory, { recursive: true })

        // only creating it, no need to add anything
        fs.writeFileSync(fullFileName, JSON.stringify(object, null, 2))
        console.log(`[Util: openThreadInfo] Created '${fullFileName}' in working directory`)
    }
}

/**
 * Method to obtain the configurations of the message chat/thread
 * 
 * @param filename name of the configuration file to get
 * @param callback function to allow a promise from getting the config
 */
export async function getThread(filename: string, callback: (config: Thread | undefined) => void): Promise<void> {
    // attempt to read the file and get the configuration
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

/**
 * Method to open the channel history
 * 
 * @param filename name of the json file for the channel by user
 * @param channel the text channel info
 * @param user the user's name
 * @param messages their messages
 */
export async function openChannelInfo(filename: string, channel: TextChannel, user: string, messages: UserMessage[] = []): Promise<void> {
    // thread exist handler
    const isThread: boolean = await new Promise((resolve) => {
        getThread(`${channel.id}.json`, (threadInfo) => {
            if (threadInfo?.messages)
                resolve(true)
            else
                resolve(false)
        })
    })

    // This is an existing thread, don't create another json
    if (isThread) return

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
        const object: Configuration = JSON.parse(`{ \"id\": \"${channel?.id}\", \"name\": \"${channel?.name}\", \"user\": \"${user}\", \"messages\": []}`)

        const directory = path.dirname(fullFileName)
        if (!fs.existsSync(directory))
            fs.mkdirSync(directory, { recursive: true })

        // only creating it, no need to add anything
        fs.writeFileSync(fullFileName, JSON.stringify(object, null, 2))
        console.log(`[Util: openChannelInfo] Created '${fullFileName}' in working directory`)
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