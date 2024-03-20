import fs from 'fs'

export interface Configuration {
    name: string
    options: {
        messageStream?: boolean,
        messageStyle?: boolean
    }
}

/**
 * Method to open a file in the working directory and modify/create it
 * 
 * @param filename name of the file
 * @param key key value to access
 * @param value new value to assign
 */
export function openFile(filename: string, key: string, value: any) {
    // check if the file exists, if not then make the config file
    if (fs.existsSync(filename)) {
        fs.readFile(filename, 'utf8', (error, data) => {
            if (error)
                console.log(`[Error: openFile] Incorrect file format`)
            else {
                const object = JSON.parse(data)
                object['options'][key] = value
                fs.writeFileSync(filename, JSON.stringify(object, null, 2))
            }
        })
    } else {
        const object: Configuration = JSON.parse('{}')

        // set standard information for config file and options
        object['name'] = 'Discord Ollama Configurations'
        object['options'] = {
            [key]: value
        }

        fs.writeFileSync(filename, JSON.stringify(object, null, 2))
        console.log(`[Util: openFile] Created 'config.json' in working directory`)
    }
}

export function getConfig(filename: string, callback: (config: Configuration | undefined) => void): void {
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