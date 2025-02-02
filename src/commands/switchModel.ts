import { ApplicationCommandOptionType, Client, CommandInteraction, Message } from "discord.js"
import { ollama } from "../client.js"
import { ModelResponse } from "ollama"
import { openConfig, UserCommand, SlashCommand } from "../utils/index.js"

export const SwitchModel: SlashCommand = {
    name: 'switch-model',
    description: 'switches current model to use.',

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
        if (!channel || !UserCommand.includes(channel.type)) return

        try {
            // Phase 1: Switch to the model
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
            // todo: problem can be here if async messes up
            if (switchSuccess) {
                // set model now that it exists
                openConfig(`${interaction.user.username}-config.json`, interaction.commandName, modelInput)
                return
            }

            // Phase 2: Notify user of failure to find model.
            interaction.editReply({
                content: `Could not find **${modelInput}** in local model library.\n\nPlease contact an server admin for access to this model.`
            })
        } catch (error) {
            // could not resolve user model switch
            interaction.editReply({
                content: `Unable to switch user preferred model to **${modelInput}**.\n\n${error}\n\nPossible solution is to request an server admin run \`/pull-model ${modelInput}\` and try again.`
            })
            return
        }
    }
}