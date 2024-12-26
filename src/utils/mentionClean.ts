/**
 * Clean up the bot user_id so it only has the prompt
 * 
 * Sample: <@CLIENT_ID> Hello
 *  - we want to remove <@CLIENT_ID>
 *  - replace function works well for this
 * 
 * @param message 
 * @returns message without client id
 */
export function clean(message: string, clientId: string): string {
    const cleanedMessage: string = message.replace(`<@${clientId}>`, '').trim()
    return cleanedMessage
}