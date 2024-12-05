import { ApplicationCommandOptionType, Client, CommandInteraction } from "discord.js";
import { SlashCommand } from "../utils/commands.js";
import { ollama } from "../client.js";
import { ModelResponse } from "ollama";
import { UserCommand } from "../utils/index.js";

export const PullModel: SlashCommand = {
    name: 'pull-model',
    description: 'pulls a model from the ollama model library. Administrator Only',

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
    run: async (client: Client, interaction: CommandInteraction) => {
        // defer reply to avoid timeout
        await interaction.deferReply()
        const modelInput: string = interaction.options.get('model-to-pull')!!.value as string

        // fetch channel and message
        const channel = await client.channels.fetch(interaction.channelId)
        if (!channel || !UserCommand.includes(channel.type)) return

        // Admin Command
        if (!interaction.memberPermissions?.has('Administrator')) {
            interaction.reply({
                content: `${interaction.commandName} is an admin command.\n\nPlease contact a server admin to pull the model you want.`,
                ephemeral: true
            })
            return
        }

        // check if model was already pulled
        const modelExists: boolean = await ollama.list()
            .then(response => response.models.some((model: ModelResponse) => model.name.startsWith(modelInput)))

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