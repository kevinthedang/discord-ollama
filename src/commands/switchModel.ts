import { ApplicationCommandOptionType, ChannelType, Client, CommandInteraction } from "discord.js";
import { SlashCommand } from "../utils/commands.js";
import { ollama } from "../client.js";
import { ModelResponse } from "ollama";
import { openConfig } from "../utils/index.js";

export const SwitchModel: SlashCommand = {
    name: 'switch-model',
    description: 'switches current model to preferred model to use.',

    // set available user options to pass to the command
    options: [
        {
            name: 'model-to-use',
            description: 'the name of the model to use',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],

    // Switch user preferred model if available in local library
    run: async (client: Client, interaction: CommandInteraction) => {
        await interaction.deferReply()

        const modelInput: string = interaction.options.get('model-to-use')!!.value as string

        // fetch channel and message
        const channel = await client.channels.fetch(interaction.channelId)
        if (!channel || ![ChannelType.PrivateThread, ChannelType.PublicThread, ChannelType.GuildText].includes(channel.type)) return

        try {
            // Phase 1: Set the model
            let switchSuccess = false
            await ollama.list()
            .then(response => {
                for (const model in response.models) {
                    const currentModel: ModelResponse = response.models[model]
                    if (currentModel.name.startsWith(modelInput)) {
                        openConfig(`${interaction.user.username}-config.json`, interaction.commandName, modelInput)

                        // successful switch
                        interaction.editReply({
                            content: `Successfully switched to **${modelInput}** as the preferred model for ${interaction.user.username}.`
                        })
                        switchSuccess = true
                    }
                }
            })
            if (switchSuccess) return

            // Phase 2: Try to get it regardless
            interaction.editReply({
                content: `Could not find **${modelInput}** in local model library, trying to pull it now...\n\nThis could take a few moments... Please be patient!`
            })

            await ollama.pull({
                model: modelInput
            })

            // set model now that it exists
            openConfig(`${interaction.user.username}-config.json`, interaction.commandName, modelInput)

            // We got the model!
            interaction.editReply({
                content: `Successfully added and set **${modelInput}** as your preferred model.`
            })
        } catch (error) {
            // could not resolve user model switch
            interaction.editReply({
                content: `Unable to switch user preferred model to **${modelInput}**.\n\n${error}\n\nPossible solution is to run \`/pull-model ${modelInput}\` and try again.`
            })
            return
        }
    }
}