// describe marks a test suite
// expect takes a value from an expression
// it marks a test case
import { describe, expect, it } from 'vitest'
import commands from '../src/commands'

/**
 * Commands test suite, tests the commands object
 * Each command is to be tested elsewhere, this file
 * is to ensure that the commands object is defined.
 * 
 * @param name name of the test suite
 * @param fn function holding tests to run
 */
describe('#commands', () => {
    // test definition of commands object
    it('references defined object', () => {
        // toBe compares the value to the expected value
        expect(typeof commands).toBe('object')
    })

    // test specific commands in the object
    it('references specific commands', () => {
        const commandsString = commands.map(e => e.name).join(', ')
        expect(commandsString).toBe('thread, private-thread, message-style, message-stream, toggle-chat, shutoff, modify-capacity, channel-toggle')
    })
})