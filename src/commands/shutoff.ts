import { Client, CommandInteraction, MessageFlags } from 'discord.js'
import { AdminCommand, SlashCommand } from '../utils/index.js'
import { createLogger } from '../components/index.js'

const logger = createLogger({ component: 'command', command: 'shutoff' })

export const Shutoff: SlashCommand = {
    name: 'shutoff',
    description: 'shutdown the bot. You will need to manually bring it online again. Administrator Only.',

    // Query for message information and set the style
    run: async (client: Client, interaction: CommandInteraction) => {
        // fetch channel and message
        const channel = await client.channels.fetch(interaction.channelId)
        if (!channel || !AdminCommand.includes(channel.type)) return

        // log this, this will probably be improtant for logging who did this
        logger.info({ actor: interaction.user.tag, bot: client.user!!.tag }, 'Shutdown requested')

        // check if admin or false on shutdown
        if (!interaction.memberPermissions?.has('Administrator')) {
            interaction.reply({
                content: `**Shutdown Aborted:**\n\n${interaction.user.tag}, You do not have permission to shutoff **${client.user?.tag}**.`,
                flags: MessageFlags.Ephemeral
            })
            return // stop from shutting down
        }

        // Shutoff cleared, do it
        interaction.reply({
            content: `${client.user?.tag} is shutting down.`,
            flags: MessageFlags.Ephemeral
        })

        logger.info({ bot: client.user?.tag }, 'Bot is shutting down')

        // clean up client instance and stop
        client.destroy()
    }
}