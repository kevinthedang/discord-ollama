import { ApplicationCommandOptionType, Client, ChatInputCommandInteraction, MessageFlags } from "discord.js"
import { ollama } from "../client.js"
import { ModelResponse } from "ollama"
import { UserCommand, SlashCommand } from "../utils/index.js"

export const PullModel: SlashCommand = {
    name: 'pull-model',
    description: 'pulls a model from the ollama model library. Administrator Only.',

    // set available user options to pass to the command
    options: [
        {
            name: 'model-to-pull',
            description: 'the name of the model to pull',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],

    // Pull for model from Ollama library
    run: async (client: Client, interaction: ChatInputCommandInteraction) => {
        // defer reply to avoid timeout
        await interaction.deferReply()
        const modelInput: string = interaction.options.getString('model-to-pull') as string
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

        // check if model was already pulled, if the ollama service isn't running throw error
        const modelExists = await ollama.list()
            .then(response => response.models.some((model: ModelResponse) => model.name.startsWith(modelInput)))
            .catch(error => {
                ollamaOffline = true
                console.error(`[Command: pull-model] Failed to connect with Ollama service. Error: ${error.message}`)
            })
       
        // Validate for any issue or if service is running
        if (ollamaOffline) {
            interaction.editReply({
                content: `The Ollama service is not running. Please turn on/download the [service](https://ollama.com/).`
            })
            return
        }


        try {
            // call ollama to pull desired model
            if (!modelExists) {
                interaction.editReply({
                    content: `**${modelInput}** could not be found. Please wait patiently as I try to retrieve it...`
                })
                await ollama.pull({ model: modelInput })
            }
        } catch (error) {
            // could not resolve pull or model unfound
            interaction.editReply({
                content: `Could not retrieve the **${modelInput}** model. You can find models at [Ollama Model Library](https://ollama.com/library).\n\nPlease check the model library and try again.`
            })
            return
        }

        // successful interaction
        if (modelExists)
            interaction.editReply({
                content: `**${modelInput}** is already available.`
            })
        else
            interaction.editReply({
                content: `Successfully added **${modelInput}**.`
            })
    }
}