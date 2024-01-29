import { Client, GatewayIntentBits } from "discord.js";
import { registerEvents } from "./utils/events.js";
import Events from "./events/index.js";

// Import keys/tokens
import Keys from "./keys.js";

// initialize the client with the following permissions when logging in
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const messageHistory = [
    {
        role: 'system',
        content: 'Your name is Ollama GU'
    }
]

registerEvents(client, Events, messageHistory)

// Try to log in the client
client.login(Keys.clientToken)
    .catch((error) => {
        console.error('[Login Error]', error);
        process.exit(1);
    });