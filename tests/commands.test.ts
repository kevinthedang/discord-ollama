// describe marks a test suite
// expect takes a value from an expression
// it marks a test case
import { describe, expect, it, vi } from 'vitest'
import commands from '../src/commands/index.js'

/**
 * Mocking client.ts because of the commands
 */
vi.mock('../src/client.js', () => ({}))

/**
 * Commands test suite, tests the commands object
 * Each command is to be tested elsewhere, this file
 * is to ensure that the commands object is defined.
 * 
 * @param name name of the test suite
 * @param fn function holding tests to run
 */
describe('Commands Existence', () => {
    // test definition of commands object
    it('references defined object', () => {
        // toBe compares the value to the expected value
        expect(typeof commands).toBe('object')
    })

    // test specific commands in the object
    it('references specific commands', () => {
        const commandsString = commands.map(e => e.name).join(', ')
        const expectedCommands = ['thread', 'private-thread', 'message-stream', 'toggle-chat', 'shutoff', 'modify-capacity', 'clear-user-channel-history', 'pull-model', 'switch-model', 'delete-model']
        expect(commandsString).toBe(expectedCommands.join(', '))
    })
})

/**
 * User Commands Test suite for testing out commands
 * that would be run by users when using the application.
 */
describe('User Command Tests', () => {
    // test capacity command
    it('run modify-capacity command', () => {

    })

    it('run clear-user-channel-history command', () => {

    })

    it('run message-stream command', () => {

    })

    it('run message-style command', () => {

    })

    it('run thread command', () => {

    })

    it('run private-thread command', () => {

    })
})

/**
 * Admin Commands Test suite for running administrative 
 * commands with the application.
 */
describe('Admin Command Tests', () => {
    it('run shutoff command', () => {

    })

    it('run toggle-chat command', () => {

    })
})