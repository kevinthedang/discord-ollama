import { ThreadChannel } from 'discord.js'
import { event, Events } from '../utils/index.js'
import fs from 'fs'

/**
 * Event to remove the associated .json file for a thread once deleted
 */
export default event(Events.ThreadDelete, async ({ logger }, thread: ThreadChannel) => {
    // iterate through every guild member in the thread and delete their history, except the bot
    try {
        logger.info({ memberCount: thread.memberCount!! - 1 }, 'Deleting thread history')
        const dirPath = 'data/'

        // read all files in data/
        fs.readdir(dirPath, (error, files) => {
            if (error) {
                logger.error({ err: error, directory: dirPath }, 'Failed to read history directory')
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
                        logger.error({ err: error, file: filePath }, 'Failed to delete thread history file')
                    else
                        logger.info({ file: filePath }, 'Deleted thread history file')
                })
            })
        })
    } catch (error) {
        logger.error({ err: error, threadId: thread.id }, 'Failed to delete user history files')
    }
})