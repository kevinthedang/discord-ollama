import { event, Events } from '../utils/index.js'

// Log when the bot successfully logs in and export it
export default event(Events.ClientReady, ({ log }, client) => {
    return log(`Logged in as ${client.user.username}.`)
})