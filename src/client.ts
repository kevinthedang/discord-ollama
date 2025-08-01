import { Client, GatewayIntentBits } from 'discord.js'
import { Ollama } from 'ollama'
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

// initialize connection to ollama container
export const ollama = new Ollama({
    host: `http://${Keys.ipAddress}:${Keys.portAddress}`,
})

// Create Queue managed by Events
const messageHistory: Queue<UserMessage> = new Queue<UserMessage>

// Create Channel History Queue managed by Events
const channelMessageHistory: Queue<UserMessage> = new Queue<UserMessage>

// register all events
registerEvents(client, Events, messageHistory, channelMessageHistory, ollama, Keys.defaultModel)

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