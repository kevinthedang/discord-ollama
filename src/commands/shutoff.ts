import { ChannelType, Client, CommandInteraction, ApplicationCommandOptionType } from 'discord.js'
import { SlashCommand } from '../utils/commands.js'
import Keys from '../keys.js'

export const Shutoff: SlashCommand = {
    name: 'shutoff',
    description: 'shutdown the bot. You will need to manually bring it online again.',

    // set available user options to pass to the command
    options: [
        {
            name: 'are-you-sure',
            description: 'true = yes, false = I\'m scared',
            type: ApplicationCommandOptionType.Boolean,
            required: true
        }
    ],

    // Query for message information and set the style
    run: async (client: Client, interaction: CommandInteraction) => {
        // fetch channel and message
        const channel = await client.channels.fetch(interaction.channelId)
        if (!channel || channel.type !== ChannelType.GuildText) return

        // log this, this will probably be improtant for logging who did this
        console.log(`User -> ${interaction.user.tag} attempting to shutdown ${client.user!!.tag}`)

        // create list of superUsers based on string parse
        const superUsers: string[] = JSON.parse(Keys.superUser.replace(/'/g, '"'))

        // check if admin or false on shutdown
        if (interaction.user.tag !in superUsers) {
            interaction.reply({
                content: `Shutdown failed:\n\n${interaction.user.tag}, You do not have permission to shutoff **${client.user?.tag}**.`,
                ephemeral: true
            })
            return // stop from shutting down
        } else if (!interaction.options.get('are-you-sure')?.value) {
            interaction.reply({
                content: `Shutdown failed:\n\n${interaction.user.tag}, You didn't want to shutoff **${client.user?.tag}**.`,
                ephemeral: true
            })
            return
        }

        interaction.reply({
            content: `${client.user?.tag} is ${interaction.options.get('are-you-sure')?.value ?  "shutting down now." : "not shutting down." }`,
            ephemeral: true
        })

        // clean up client instance and stop
        client.destroy()
    }
}