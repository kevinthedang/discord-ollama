import type { ClientEvents, Awaitable, Client } from 'discord.js'
import { Ollama } from 'ollama'
import { Queue } from '../components/index.js'

// Export events through here to reduce amount of imports
export { Events } from 'discord.js'

export type LogMethod = (...args: unknown[]) => void
export type EventKeys = keyof ClientEvents // only wants keys of ClientEvents object

/**
 * Parameters to run the chat query
 * @param model the model to run
 * @param ollama ollama api client
 * @param msgHist message history
 */
export type ChatParams = {
    model: string,
    ollama: Ollama,
    msgHist: UserMessage[]
}

/** 
 * Format for the messages to be stored when communicating when the bot
 * @param role either assistant, user, or system
 * @param content string of the message the user or assistant provided
 * @param images array of images that the user or assistant provided
 */
export type UserMessage = {
    role: string,
    content: string,
    images: string[] // May or may not have images in message
}

// Event properties
export interface EventProps {
    client: Client,
    log: LogMethod,
    msgHist: Queue<UserMessage>,
    ollama: Ollama,
    defaultModel: String
}

/**
 * Format for the callback function tied to an event
 * @param props the properties of the event
 * @param args the arguments of the event
 */
export type EventCallback<T extends EventKeys> = (
    props: EventProps,
    ...args: ClientEvents[T]
) => Awaitable<unknown> // Method can be synchronous or async, unknown so we can return anything

// Event interface
export interface Event<T extends EventKeys = EventKeys> {
    key: T
    callback: EventCallback<T>
}

/**
 * Method to create an event object
 * @param key type of event
 * @param callback function to run when event is triggered
 * @returns event object
 */
export function event<T extends EventKeys>(key: T, callback: EventCallback<T>): Event<T> {
    return { key, callback }
}

/**
 * Method to register events to the bot per file in the events directory
 * @param client initialized bot client
 * @param events all the exported events from the index.ts in the events dir
 * @param msgHist The message history of the bot
 * @param ollama the initialized ollama instance
 */
export function registerEvents(
    client: Client,
    events: Event[],
    msgHist: Queue<UserMessage>,
    ollama: Ollama,
    defaultModel: String
): void {
    for (const { key, callback } of events) {
        client.on(key, (...args) => {
            // Create a new log method for this event
            const log = console.log.bind(console, `[Event: ${key}]`)

            // Handle Errors, call callback, log errors as needed
            try {
                callback({ client, log, msgHist, ollama, defaultModel }, ...args)
            } catch (error) {
                log('[Uncaught Error]', error)
            }
        })
    }
}