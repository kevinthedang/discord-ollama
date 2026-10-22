import { event, Events } from '../utils/index.js'
import commands from '../commands/index.js'
import { createLogger } from '../components/index.js'

/**
 * Interaction creation listener for the client
 * @param interaction the interaction received from the server
 */
export default event(Events.InteractionCreate, async ({ logger, client }, interaction) => {
    if (!interaction.isCommand() || !interaction.isChatInputCommand()) return

    logger.info({ command: interaction.commandName, user: interaction.user.tag }, 'Interaction received')

    // ensure command exists, otherwise kill event
    const command = commands.find(command => command.name === interaction.commandName)
    if (!command) return

    // the command exists, execute it
    const commandLogger = createLogger({
        component: 'command',
        command: command.name
    }, logger)

    void Promise.resolve(command.run(client, interaction, commandLogger))
        .catch(error => commandLogger.error({ err: error }, 'Command execution failed'))
})