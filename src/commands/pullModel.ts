import { ApplicationCommandOptionType, ChannelType, Client, CommandInteraction } from "discord.js";
import { SlashCommand } from "../utils/commands.js";
import { ollama } from "../client.js";
import { ModelResponse } from "ollama";

export const PullModel: SlashCommand = {
    name: 'pull-model',
    description: 'pulls a model from the ollama model library',

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
        if (!channel || ![ChannelType.PrivateThread, ChannelType.PublicThread, ChannelType.GuildText].includes(channel.type)) return

        // check if model was already pulled
        const modelExists: boolean = await ollama.list()
            .then(response => response.models.some((model: ModelResponse) => model.name.startsWith(modelInput)))

        try {
            // call ollama to pull desired model
            if (!modelExists)
                await ollama.pull({ model: modelInput })
        } catch (error) {
            // could not resolve pull or model unfound
            interaction.editReply({
                content: `Could not pull/locate the **${modelInput}** model within the [Ollama Model Library](https://ollama.com/library).\n\nPlease check the model library and try again.`
            })
            return
        }

        // successful interaction
        if (modelExists)
            interaction.editReply({
                content: `**${modelInput}** is already in your local model library.`
            })
        else
            interaction.editReply({
                content: `Successfully added **${modelInput}** into your local model library.`
            })
    }
}