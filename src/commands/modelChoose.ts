import { ApplicationCommandOptionType, ChannelType, Client, CommandInteraction } from 'discord.js'
import { SlashCommand } from '../utils/commands.js'
import { openConfig } from '../utils/jsonHandler.js'

export const ChooseModel: SlashCommand = {
    name: 'choose-model',
    description: 'sets the model to use',

    // set user option for model selected
    options: [
        {
            name: 'model',
            description: 'select a model to use',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],

    // Query for model presence and set the model
    run: async (client: Client, interaction: CommandInteraction) => {
        // fetch channel and message
        const channel = await client.channels.fetch(interaction.channelId)
        if (!channel || channel.type !== (ChannelType.PublicThread && ChannelType.GuildText)) return

        // check if the model is available
        //!! query the Ollama API endpoint for local models
    }
}