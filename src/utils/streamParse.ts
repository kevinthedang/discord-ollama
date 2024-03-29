import { AxiosResponse } from 'axios'

/**
 * When running a /api/chat stream, the output needs to be parsed into an array of objects
 *  This method is used for development purposes and testing
 * 
 * This will not work as intended with the inclusion of ollama-js, needs to be modified to work with it
 * 
 * @param stream Axios response to from Ollama
 */
export function parseStream(stream: AxiosResponse<any, any>) {
    // split string by newline
    const keywordObjects: string[] = stream.data.trim().split('\n')

    // parse string and load them into objects
    const keywordsArray: {
        model: string,
        created_at: string,
        message: {
            role: string,
            content: string
        },
        done: boolean
    }[] = keywordObjects.map((keywordString) => JSON.parse(keywordString))

    return keywordsArray
}