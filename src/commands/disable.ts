import { Client, ChatInputCommandInteraction, ApplicationCommandOptionType, MessageFlags } from 'discord.js'
import { AdminCommand, openConfig, SlashCommand } from '../utils/index.js'

export const Disable: SlashCommand = {
    name: 'toggle-chat',
    description: 'toggle all chat features. Adminstrator Only.',

    // set available user options to pass to the command
    options: [
        {
            name: 'enabled',
            description: 'true = enabled, false = disabled',
            type: ApplicationCommandOptionType.Boolean,
            required: true
        }
    ],

    // Query for message information and set the style
    run: async (client: Client, interaction: ChatInputCommandInteraction) => {
        // fetch channel and message
        const channel = await client.channels.fetch(interaction.channelId)
        if (!channel || !AdminCommand.includes(channel.type)) return

        // check if runner is an admin
        if (!interaction.memberPermissions?.has('Administrator')) {
            interaction.reply({
                content: `${interaction.commandName} is an admin command.\n\nPlease contact an admin to use this command for you.`,
                flags: MessageFlags.Ephemeral
            })
            return
        }

        // set state of bot chat features
        openConfig(`${interaction.guildId}-config.json`, interaction.commandName,
            interaction.options.getBoolean('enabled')
        )

        interaction.reply({
            content: `${client.user?.username} is now **${interaction.options.getBoolean('enabled') ? "enabled" : "disabled"}**.`,
            flags: MessageFlags.Ephemeral
        })
    }
}