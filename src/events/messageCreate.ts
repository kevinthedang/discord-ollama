import { event, Events } from '../utils/index.js'
import Axios from 'axios'

/*
 * Max Message length for free users is 2000 characters (bot or not).
 */
export default event(Events.MessageCreate, ({ log }, message) => {
    log(`Message created \"${message.content}\" from ${message.author.tag}.`)

    // Hard-coded channel to test output there only, in our case "ollama-endpoint"
    if (message.channelId != '1188262786497785896') {
        log(`Unauthorized Channel input, Aborting...`)
        return
    }
    log(`Channel id OK!`)

    // Do not respond if bot talks in the chat
    if (message.author.tag === message.client.user.tag) {
        log(`Found Bot message reply, Aborting...`)
        return
    }
    log(`Sender Checked!`)

    // Request made to API
    const request = async () => {
        try {
            const response = await Axios.post('http://127.0.0.1:11434/api/generate', {
                model: 'llama2',
                prompt: message.content,
                stream: false
            })
            log(response.data)
            //
            message.reply(response.data['response'])
        } catch (error) {
            log(error)
        }
    }
    
    // Attempt to call ollama's endpoint
    request()
})