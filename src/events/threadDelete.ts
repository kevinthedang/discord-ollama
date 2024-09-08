import { ThreadChannel } from 'discord.js'
import { event, Events } from '../utils/index.js'
import fs from 'fs'

/**
 * Event to remove the associated .json file for a thread once deleted
 */
export default event(Events.ThreadDelete, ({ log }, thread: ThreadChannel) => {
    // iterate through every guild member in the thread and delete their history, except the bot
    log(thread.guildMembers)
    for (const member in thread.guildMembers)
        log(member)

    const filePath = `data/${thread.id}-${thread.guildMembers}.json`
    if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (error) => {
            if (error)
                log(`Error deleting file ${filePath}`, error)
            else
                log(`Successfully deleted ${filePath} thread info`)
        })
    } else {
        log(`File ${filePath} does not exist.`)
    }
})