import 'dotenv/config'
import { Client, IntentsBitField } from "discord.js"

const client = new Client({
    // Declared client intents
    intents: [
        IntentsBitField.Flags.Guilds, 
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.MessageContent
    ]
})

// On-Ready Listener
client.on('ready', (client) => {
    console.log(`${client.user.username} is online.`)
})

// Log in with token
client.login(process.env.botToken)
