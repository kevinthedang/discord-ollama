import { ApplicationCommandOptionType, ChatInputCommandInteraction, Client, CommandInteraction, MessageFlags } from 'discord.js'
import { UserCommand, SlashCommand } from '../utils/index.js'
import { ollama } from '../client.js'
import { ModelResponse } from 'ollama'

export const DeleteModel: SlashCommand = {
    name: 'delete-model',
    description: 'deletes a model from the local list of models. Administrator Only.',

    // set available user options to pass to the command
    options: [
        {
            name: 'model-name',
            description: 'the name of the model to delete',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],

    // Delete Model locally stored
    run: async (client: Client, interaction: ChatInputCommandInteraction) => {
        // defer reply to avoid timeout
        await interaction.deferReply()
        const modelInput: string = interaction.options.getString('model-name') as string
        let ollamaOffline: boolean = false

        // fetch channel and message
        const channel = await client.channels.fetch(interaction.channelId)
        if (!channel || !UserCommand.includes(channel.type)) return

        // Admin Command
        if (!interaction.memberPermissions?.has('Administrator')) {
            interaction.reply({
                content: `${interaction.commandName} is an admin command.\n\nPlease contact a server admin to pull the model you want.`,
                flags: MessageFlags.Ephemeral
            })
            return
        }

        // check if model exists
        const modelExists = await ollama.list()
            .then(response => response.models.some((model: ModelResponse) => model.name.startsWith(modelInput)))
            .catch(error => {
                ollamaOffline = true
                console.error(`[Command: delete-model] Failed to connect with Ollama service. Error: ${error.message}`)
            })

        // Validate for any issue or if service is running
        if (ollamaOffline) {
            interaction.editReply({
                content: `The Ollama service is not running. Please turn on/download the [service](https://ollama.com/).`
            })
            return
        }

            
        try {
            // call ollama to delete model
            if (modelExists) {
                await ollama.delete({ model: modelInput })
                interaction.editReply({
                    content: `**${modelInput}** was removed from the the library.`
                })
            } else
                throw new Error()
        } catch (error) {
            // could not delete the model
            interaction.reply({
                content: `Could not delete the **${modelInput}** model. It probably doesn't exist or you spelled it incorrectly.\n\nPlease try again if this is a mistake.`,
                flags: MessageFlags.Ephemeral
            })
        }
    }
}