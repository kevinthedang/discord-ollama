import { ApplicationCommandOptionType, ChannelType, Client, CommandInteraction } from "discord.js";
import { SlashCommand } from "../utils/commands.js";
import { ollama } from "../client.js";

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

        // fetch channel and message
        const channel = await client.channels.fetch(interaction.channelId)
        if (!channel || channel.type !== (ChannelType.PrivateThread && ChannelType.PublicThread && ChannelType.GuildText)) return

        try {
            // call ollama to pull desired model
            await ollama.pull({
                model: interaction.options.get('model-to-pull')!!.value as string
            })
        } catch (error) {
            // could not resolve pull or model unfound
            interaction.editReply({
                content: `Could not pull/locate the **${interaction.options.get('model-to-pull')!!.value}** model within the [Ollama Model Library](https://ollama.com/library).\n\nPlease check the model library and try again.`
            })
            return
        }

        // successful pull
        interaction.editReply({
            content: `Successfully added **${interaction.options.get('model-to-pull')!!.value}** into your local model library.`
        })
    }
}