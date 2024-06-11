import { ChannelType, Client, CommandInteraction, ApplicationCommandOptionType } from 'discord.js'
import { SlashCommand } from '../utils/commands.js'
import { openConfig } from '../utils/jsonHandler.js'

export const Disable: SlashCommand = {
    name: 'toggle-chat',
    description: 'toggle all chat features, Adminstrator Only.',

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
    run: async (client: Client, interaction: CommandInteraction) => {
        // fetch channel and message
        const channel = await client.channels.fetch(interaction.channelId)
        if (!channel || channel.type !== ChannelType.GuildText) return

        // check if runner is an admin
        if (!interaction.memberPermissions?.has('Administrator')) {
            interaction.reply({
                content: `${interaction.commandName} is an Administrator Command.\n\nYou, ${interaction.member?.user.username}, are not an Administrator in this server.\nPlease contact an admin to use this command.`,
                ephemeral: true
            })
            return
        }

        // set state of bot chat features
        openConfig('config.json', interaction.commandName, interaction.options.get('enabled')?.value)

        interaction.reply({
            content: `Chat features has been \`${interaction.options.get('enabled')?.value ?  "enabled" : "disabled" }\``,
            ephemeral: true
        })
    }
}