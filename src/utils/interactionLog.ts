import { Interaction } from "discord.js"

// log method type definition
export type LogMethod = (...args: unknown[]) => void

/**
 * Method to bind the console.log method in all types of interactions
 * 
 * @param interaction the interaction that occurred
 * @param args the arguments to log
 */
function log(interaction: Interaction, name: string, message: string): void {
    // pass type, name, and message for interaction
    console.log.bind(console, `[${interaction.type}: ${name}] ${message}`)
}
