import Keys from "../keys.js"

/**
 * Clean up the bot user_id so it only has the prompt
 * 
 * Sample: <@CLIENT_ID> Hello
 *  - we want to remove <@CLIENT_ID>
 *  - replace function works well for this
 * 
 * @param message 
 * @returns 
 */
export function clean(message: string): string {
    const cleanedMessage: string = message.replace(`<@${Keys.clientUid}>`, '').trim()
    return cleanedMessage
}