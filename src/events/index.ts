import { Event } from '../utils/index.js'
import interactionCreate from './interactionCreate.js'
import messageCreate from './messageCreate.js'
import ready from './ready.js'

// Centralized export for all events
export default [
    ready,
    messageCreate,
    interactionCreate
] as Event[] // staticly is better ts practice, dynamic exporting is possible