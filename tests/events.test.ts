import { describe, expect, it } from 'vitest'
import events from '../src/events/index.js'

/**
 * Events test suite, tests the events object
 * Each event is to be tested elsewhere, this file
 * is to ensure that the events object is defined.
 * 
 * @param name name of the test suite
 * @param fn function holding tests to run
 */
describe('Events Existence', () => {
    // test definition of events object
    it('references defined object', () => {
        expect(typeof events).toBe('object')
    })

    // test specific events in the object
    it('references specific events', () => {
        const eventsString = events.map(e => e.key.toString()).join(', ')
        expect(eventsString).toBe('ready, messageCreate, interactionCreate, threadDelete')
    })
})