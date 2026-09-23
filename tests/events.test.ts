import { describe, expect, it, vi } from 'vitest'
import events from '../src/events/index.js'

/**
 * Mocking ollama found in client.ts because pullModel.ts
 * relies on the existence on ollama. To prevent the mock,
 * we will have to pass through ollama to the commands somehow.
 */
vi.mock('../src/client.js', () => ({
    ollama: {
        pull: vi.fn() // Mock the pull method found with ollama
    }
}))

/**
 * Events test suite, tests the events object
 * Each event is to be tested elsewhere, this file
 * is to ensure that the events object is defined.
 */
describe('Events Existence', () => {
    // test definition of events object
    it('references defined object', () => {
        expect(typeof events).toBe('object')
    })

    // test specific events in the object
    it('references specific events', () => {
        const eventsString = events.map(e => e.key.toString()).join(', ')
        expect(eventsString).toBe('clientReady, messageCreate, interactionCreate, threadDelete')
    })
})