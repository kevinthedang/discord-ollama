import { ThreadChannel } from 'discord.js'
import { event, Events } from '../utils/index.js'
import fs from 'fs'

/**
 * Event to remove the associated .json file for a thread once deleted
 */
export default event(Events.ThreadDelete, async ({ log }, thread: ThreadChannel) => {
    // iterate through every guild member in the thread and delete their history, except the bot
    try {
        log(`Number of User Guild Members in Thread being deleted: ${thread.memberCount!! - 1}`)
        const dirPath = 'data/'

        // read all files in data/
        fs.readdir(dirPath, (error, files) => {
            if (error) {
                log(`Error reading directory ${dirPath}`, error)
                return
            }

            // filter files by thread id being deleted
            const filesToDiscard = files.filter(
                file => file.startsWith(`${thread.id}-`) &&
                    file.endsWith('.json'))

            // remove files by unlinking
            filesToDiscard.forEach(file => {
                const filePath = dirPath + file
                fs.unlink(filePath, error => {
                    if (error)
                        log(`Error deleting file ${filePath}`, error)
                    else
                        log(`Successfully deleted ${filePath} thread information`)
                })
            })
        })
    } catch (error) {
        log(`Issue deleting user history files from ${thread.id}`)
    }
})