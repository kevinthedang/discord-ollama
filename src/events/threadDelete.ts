import { ThreadChannel } from 'discord.js'
import { event, Events } from '../utils/index.js'
import fs from 'fs'

/**
 * Event to remove the associated .json file for a thread once deleted
 */
export default event(Events.ThreadDelete, ({ log }, thread: ThreadChannel) => {
    // iterate through every guild member in the thread and delete their history, except the bot
    // log(thread.guildMembers)
    for (const [id, guildMember] of thread.guildMembers) {
        log(`Removing ${guildMember.user.username} from ${thread.name}`)

        // bot wont have a chat history.
        if (!guildMember.user.bot) {
            const filePath = `data/${thread.id}-${guildMember.user.username}.json`
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
        }
    }

    
})