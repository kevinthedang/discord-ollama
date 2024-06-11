import { ThreadChannel } from 'discord.js'
import { event, Events } from '../utils/index.js'
import fs from 'fs'

/**
 * Event to remove the associated .json file for a thread once deleted
 */
export default event(Events.ThreadDelete, ({ log }, thread: ThreadChannel) => {
    const filePath = `data/${thread.id}.json`
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