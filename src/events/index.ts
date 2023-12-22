import { Event } from '../utils/index.js'
import ready from './ready.js'

// Centralized export for all events
export default [
    ready
] as Event[] // staticly is better ts practice, dynamic exporting is possible