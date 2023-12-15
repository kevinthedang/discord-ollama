require('dotenv').config()
const { Client, IntentsBitField } = require('discord.js')

// Create a new client (aka bot) with the following permissions
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ]
})

// Listener to log when the bot in online
client.on('ready', (userInfo) => {
    console.log(`'${userInfo.user.username}' is Online!`)
})

// Tell Bot to log in
client.login(process.env.TOKEN)