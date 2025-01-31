import { Attachment } from "discord.js"

/**
 * Method to convert a Discord attachment url to an array buffer
 * 
 * @param url Discord Attachment Url
 * @returns array buffer from Attachment Url
 */
async function getAttachmentBuffer(url: string): Promise<ArrayBuffer> {
    // Get the data from the image
    const response = await fetch(url)

    // Validate the image came in fine
    if (!response.ok)
        throw new Error('Failed to fetch the attachment.')

    // Return image as Buffer
    return await response.arrayBuffer()
}

/**
 * Method to convert an array buffer to a Base64 String
 * 
 * @param buffer Array Buffer from attachment
 * @returns converted Base64 string
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
    // Converting to Uint8Array
    const uint8Array = new Uint8Array(buffer)
    let binary = ''
    const len = uint8Array.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(uint8Array[i])
    }

    // Return as Base64
    return Buffer.from(binary, 'binary').toString('base64')
}

/**
 * Method to retrieve the Base64 Array of provided Message Attachment
 * 
 * @param attachment Message Attachment from Discord
 * @returns Base64 string array
 */
export async function getAttachmentData(attachment: Attachment | undefined): Promise<string[]> {
    const url: string = attachment !== undefined ? attachment.url : "Missing Url"

    // case of no attachment
    if (url === "Missing Url")
        return []

    // Convert data to base64
    const buffer = await getAttachmentBuffer(url)
    const base64String = arrayBufferToBase64(buffer)
    return [base64String]
}

/**
 * Method to retrieve the string data from the text file
 * 
 * @param attachment the text file to convert to a string
 */
export async function getTextFileAttachmentData(attachment: Attachment): Promise<string> {
    return await (await fetch(attachment.url)).text()
}