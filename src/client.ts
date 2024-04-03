import { Client, GatewayIntentBits } from 'discord.js'
import { UserMessage, registerEvents } from './utils/events.js'
import Events from './events/index.js'
import { Ollama } from 'ollama'
import { Queue } from './queues/queue.js'

// Import keys/tokens
import Keys from './keys.js'


// initialize the client with the following permissions when logging in
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// initialize connection to ollama container
const ollama = new Ollama({
    host: `http://${Keys.ipAddress}:${Keys.portAddress}`,
})

// Create Queue managed by Events
const messageHistory: Queue<UserMessage> = new Queue<UserMessage>
messageHistory.enqueue({
    role: 'assistant',
    content: `My name is ${client.user?.username}`
})

/**
 * register events for bot to listen to in discord
 * @param messageHistory message history for the llm
 * @param Events events to register
 * @param client the bot reference
 * @param Keys tokens from .env files
 */
registerEvents(client, Events, messageHistory, Keys, ollama)

// Try to log in the client
await client.login(Keys.clientToken)
.catch((error) => {
    console.error('[Login Error]', error)
    process.exit(1)
})