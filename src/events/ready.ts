import { event, Events } from '../utils/index.js'

export default event(Events.ClientReady, ({ log }, client) => {
    return log(`Logged in as ${client.user.username}.`)
})