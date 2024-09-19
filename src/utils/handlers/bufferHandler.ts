import { Attachment } from "discord.js"

async function getAttachmentBuffer(url: string): Promise<ArrayBuffer> {
    console.log(url)
    // Get the data from the image
    const response = await fetch(url)
    console.log('After fetch()')

    // Validate the image came in fine
    if (!response.ok)
        throw new Error('Failed to fetch the attachment.')

    // Return image as Buffer
    return await response.arrayBuffer()
}

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

export async function getAttachmentData(attachment: Attachment | undefined): Promise<string[]> {
    console.log(`The attachment is: ${attachment}`)
    const url: string = attachment !== undefined ? attachment.url : "Missing Url"

    // case of no attachment
    if (url === "Missing Url")
        return []

    console.log(`before buffer with url as ${url || "Invalid"}`)
    // Convert data to base64
    const buffer = await getAttachmentBuffer(url)
    console.log('Before ArrayBuffer to Base64')
    const base64String = arrayBufferToBase64(buffer)
    console.log(`finished getAttachmentData with ${base64String}`)
    return [base64String]
}