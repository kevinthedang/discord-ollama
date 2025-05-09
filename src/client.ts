import { Client, GatewayIntentBits } from 'discord.js'
import { Ollama } from 'ollama'
import { createClient } from 'redis'
import { Queue } from './queues/queue.js'
import { UserMessage, registerEvents } from './utils/index.js'
import Events from './events/index.js'
import Keys from './keys.js'

// initialize the client with the following permissions when logging in
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

// initialize connection to redis
const redis = createClient({
    url: `redis://${Keys.redisHost}:${Keys.redisPort}`,
})

// initialize connection to ollama container
export const ollama = new Ollama({
    host: `http://${Keys.ipAddress}:${Keys.portAddress}`,
})

// Create Queue managed by Events
const messageHistory: Queue<UserMessage> = new Queue<UserMessage>

// register all events
registerEvents(client, Events, messageHistory, ollama, Keys.defaultModel)

// Try to connect to redis
try {
    await redis.connect()
    console.log('[Redis] Successfully Connected')
} catch(error) {
    console.error('[Redis] Connection Error. See error below:\n', error)
    console.warn('[Redis] Failed to connect to Redis Database, using local system')
    // TODO: create boolean flag that will probably be used in messageCreate.ts if redis database is down
    // When implementing this boolean flag, move connection to database BEFORE the registerEvents method
}

// Try to log in the client
await client.login(Keys.clientToken)
    .catch((error) => {
        console.error('[Login Error]', error)
        process.exit(1)
    })

// queue up bots name
messageHistory.enqueue({
    role: 'assistant',
    content: `My name is ${client.user?.username}`,
    images: []
})