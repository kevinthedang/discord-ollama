import { Configuration, ServerConfig, UserConfig, isServerConfigurationKey } from '../index.js'
import fs from 'fs'
import path from 'path'

/**
 * Method to open a file in the working directory and modify/create it
 * 
 * @param filename name of the file
 * @param key key value to access
 * @param value new value to assign
 */
// add type of change (server, user)
export function openConfig(this: any, filename: string, key: string, value: any) {
    const fullFileName = `data/${filename}`

    // check if the file exists, if not then make the config file
    if (fs.existsSync(fullFileName)) {
        fs.readFile(fullFileName, 'utf8', (error, data) => {
            if (error)
                console.log(`[Error: openConfig] Incorrect file format`)
            else {
                const object = JSON.parse(data)
                object['options'][key] = value
                fs.writeFileSync(fullFileName, JSON.stringify(object, null, 2))
            }
        })
    } else { // work on dynamic file creation
        let object: Configuration
        if (isServerConfigurationKey(key))
            object = JSON.parse('{ \"name\": \"Server Confirgurations\" }')
        else
            object = JSON.parse('{ \"name\": \"User Confirgurations\" }')

        // set standard information for config file and options
        object['options'] = {
            [key]: value
        }

        const directory = path.dirname(fullFileName)
        if (!fs.existsSync(directory))
            fs.mkdirSync(directory, { recursive: true })

        fs.writeFileSync(`data/${filename}`, JSON.stringify(object, null, 2))
        console.log(`[Util: ${this.name}] Created '${filename}' in working directory`)
    }
}

/**
 * Method to obtain the configurations of the message chat/thread
 * 
 * @param filename name of the configuration file to get
 * @param callback function to allow a promise from getting the config
 */
export async function getServerConfig(filename: string, callback: (config: ServerConfig | undefined) => void): Promise<void> {
    const fullFileName = `data/${filename}`

    // attempt to read the file and get the configuration
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
 * Method to obtain the configurations of the message chat/thread
 * 
 * @param filename name of the configuration file to get
 * @param callback function to allow a promise from getting the config
 */
export async function getUserConfig(filename: string, callback: (config: UserConfig | undefined) => void): Promise<void> {
    const fullFileName = `data/${filename}`

    // attempt to read the file and get the configuration
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
