import type { ClientEvents, Awaitable, Client, User } from 'discord.js'
import { Ollama } from 'ollama'
import { Queue } from '../queues/queue.js'

// Export events through here to reduce amount of imports
export { Events } from 'discord.js'

export type LogMethod = (...args: unknown[]) => void
export type EventKeys = keyof ClientEvents // only wants keys of ClientEvents object

/**
 * Tokens to run the bot as intended
 * @param channel the channel where the bot will respond to queries
 * @param model chosen model for the ollama to utilize
 * @param clientUid the discord id for the bot
 */
export type Tokens = {
    channel: string,
    model: string,
    clientUid: string
}

/** 
 * Format for the messages to be stored when communicating when the bot
 * @param role either assistant, user, or system
 * @param content string of the message the user or assistant provided
 */
export type UserMessage = {
    role: string,
    content: string
}

// Event properties
export interface EventProps {
    client: Client
    log: LogMethod
    msgHist: Queue<UserMessage>
    tokens: Tokens,
    ollama: Ollama
}
export type EventCallback<T extends EventKeys> = (
    props: EventProps,
    ...args: ClientEvents[T]
) => Awaitable<unknown> // Method can be synchronous or async, unknown so we can return anything

// Event interface
export interface Event<T extends EventKeys = EventKeys> {
    key: T
    callback: EventCallback<T>
}

export function event<T extends EventKeys>(key: T, callback: EventCallback<T>): Event<T> {
    return { key, callback }
}

/**
 * Method to register events to the bot per file in the events directory
 * @param client initialized bot client
 * @param events all the exported events from the index.ts in the events dir
 * @param msgHist The message history of the bot
 * @param tokens the passed in environment tokens for the service
 * @param ollama the initialized ollama instance
 */
export function registerEvents(
    client: Client, 
    events: Event[], 
    msgHist: Queue<UserMessage>,
    tokens: Tokens,
    ollama: Ollama
): void {
    for (const { key, callback } of events) {
        client.on(key, (...args) => {
            // Create a new log method for this event
            const log = console.log.bind(console, `[Event: ${key}]`)

            // Handle Errors, call callback, log errors as needed
            try {
                callback({ client, log, msgHist, tokens, ollama }, ...args)
            } catch (error) {
                log('[Uncaught Error]', error)
            }
        })
    }
}