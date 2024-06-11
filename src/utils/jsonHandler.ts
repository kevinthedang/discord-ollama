import { ThreadChannel } from 'discord.js'
import { UserMessage } from './events.js'
import fs from 'fs'
import path from 'path'

export interface Configuration {
    readonly name: string
    options: {
        'message-stream'?: boolean,
        'message-style'?: boolean,
        'toggle-chat'?: boolean,
        'modify-capacity'?: number
    }
}

export interface Thread {
    readonly id: string
    readonly name: string
    messages: UserMessage[]
}

/**
 * Method to open a file in the working directory and modify/create it
 * 
 * @param filename name of the file
 * @param key key value to access
 * @param value new value to assign
 */
export function openConfig(filename: string, key: string, value: any) {
    // check if the file exists, if not then make the config file
    if (fs.existsSync(filename)) {
        fs.readFile(filename, 'utf8', (error, data) => {
            if (error)
                console.log(`[Error: openConfig] Incorrect file format`)
            else {
                const object = JSON.parse(data)
                object['options'][key] = value
                fs.writeFileSync(filename, JSON.stringify(object, null, 2))
            }
        })
    } else { // work on dynamic file creation
        const object: Configuration = JSON.parse('{ \"name\": \"Discord Ollama Confirgurations\" }')

        // set standard information for config file and options
        object['options'] = {
            [key]: value
        }

        fs.writeFileSync(filename, JSON.stringify(object, null, 2))
        console.log(`[Util: openConfig] Created '${filename}' in working directory`)
    }
}

/**
 * Method to obtain the configurations of the message chat/thread
 * 
 * @param filename name of the configuration file to get
 * @param callback function to allow a promise from getting the config
 */
export async function getConfig(filename: string, callback: (config: Configuration | undefined) => void): Promise<void> {
    // attempt to read the file and get the configuration
    if (fs.existsSync(filename)) {
        fs.readFile(filename, 'utf8', (error, data) => {
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
                console.log(`[Error: openConfig] Incorrect file format`)
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