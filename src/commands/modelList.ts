import { Client, CommandInteraction } from 'discord.js'
import { SlashCommand } from '../utils/commands.js'

export const ListModels: SlashCommand = {
    name: 'model-list',
    description: 'list ollama models to use',

    // Query for available models in the environment
    run: async (client: Client, interaction: CommandInteraction) => {
        //!! Waiting for an API endpoint from Ollama to fetch the model list

        interaction.reply({
            content: `List of available models not accessible at this time.`,
            ephemeral: true
        })
    }
}