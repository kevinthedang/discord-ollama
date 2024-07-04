import { ApplicationCommandOptionType, ChannelType, Client, CommandInteraction } from 'discord.js'
import { SlashCommand } from '../utils/commands.js'
import { openConfig } from '../utils/jsonHandler.js'

export const ChannelToggle: SlashCommand = {
    name: 'channel-toggle',
    description: 'toggles channel or thread usage.',

    // set user option for toggling
    options: [
        {
            name: 'toggle-channel',
            description: 'toggle channel usage, otherwise threads',
            type: ApplicationCommandOptionType.Boolean,
            required: true
        }
    ],

    // Query for chatting preference
    run: async (client: Client, interaction: CommandInteraction) => {
        // fetch channel location
        const channel = await client.channels.fetch(interaction.channelId)
        if (!channel || channel.type !== (ChannelType.PublicThread && ChannelType.GuildText)) return


        // set state of bot channel preferences
        openConfig(`${interaction.guildId}-config.json`, interaction.commandName, interaction.options.get('toggle-channel')?.value)

        interaction.reply({
            content: `Channel Preferences have for Regular Channels set to \`${interaction.options.get('toggle-channel')?.value}\``,
            ephemeral: true
        })
    }
}
