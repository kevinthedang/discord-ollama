import type { ClientEvents, Awaitable, Client } from 'discord.js'
import { Ollama } from 'ollama'

// Export events through here to reduce amount of imports
export { Events } from 'discord.js'

export type LogMethod = (...args: unknown[]) => void
export type EventKeys = keyof ClientEvents // only wants keys of ClientEvents object
export type Tokens = {
    channel: string,
    model: string,
    clientUid: string
}

// Event properties
export interface EventProps {
    client: Client
    log: LogMethod
    msgHist: { role: string, content: string }[]
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

export function registerEvents(
    client: Client, 
    events: Event[], 
    msgHist: { role: string, content: string }[],
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