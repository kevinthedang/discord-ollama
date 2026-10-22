import { Writable } from 'node:stream'
import pino from 'pino'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createLogger } from '../src/components/logger.js'

describe('Pino logger', () => {
    let output = ''
    const destination = new Writable({
        write(chunk, _encoding, callback) {
            output += chunk.toString()
            callback()
        }
    })
    const parentLogger = pino({ level: 'trace' }, destination)

    beforeEach(() => {
        vi.stubEnv('NODE_ENV', 'test')
    })

    afterEach(() => {
        vi.unstubAllEnvs()
    })

    it('creates a child logger with component and caller metadata', () => {
        output = ''
        const logger = createLogger({ component: 'test' }, parentLogger)
        logger.info('bound message')

        const entry = JSON.parse(output)
        expect(entry.msg).toBe('bound message')
        expect(entry.component).toBe('test')
        expect(entry.caller).toMatch(/logger\.test\.ts:\d+:\d+/)
    })

    it('supports native Pino levels and structured log fields', () => {
        output = ''
        const logger = createLogger({ component: 'test' }, parentLogger)
        logger.warn({ answer: 42 }, 'warning')

        const entry = JSON.parse(output)
        expect(entry.level).toBe(40)
        expect(entry.answer).toBe(42)
        expect(entry.msg).toBe('warning')
    })

    it('preserves parent context when adding command bindings', () => {
        output = ''
        const eventLogger = createLogger({
            component: 'event',
            event: 'InteractionCreate'
        }, parentLogger)
        const commandLogger = createLogger({
            component: 'command',
            command: 'summary'
        }, eventLogger)

        commandLogger.info('command started')

        const entry = JSON.parse(output)
        expect(entry.component).toBe('command')
        expect(entry.event).toBe('InteractionCreate')
        expect(entry.command).toBe('summary')
    })
})
