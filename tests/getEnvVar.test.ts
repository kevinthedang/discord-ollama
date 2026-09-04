import { describe, expect, it } from 'vitest'
import { getEnvVar } from '../src/utils/index.js'

/**
 * getEnvVar test suite, tests the getEnvVar function
 * 
 * @param name name of the test suite
 * @param fn function holding tests to run
 */
describe('Environment Setup', () => {
    // dummy set of keys
    const keys = {
        clientToken: 'CLIENT_TOKEN',
    }

    // set keys in environment
    process.env['clientToken'] = keys.clientToken

    // test for non-empty string
    it('returns a non-empty string', () => {
        expect(getEnvVar('CLIENT_TOKEN')).not.toBe('')
    })

    // test for string type
    it('returns a string', () => {
        expect(typeof getEnvVar('CLIENT_TOKEN')).toBe('string')
    })

    // test for distinct key
    it('returns a distinct key', () => {
        expect(getEnvVar('CLIENT_TOKEN')).toEqual(process.env[keys.clientToken])
    })

    // test for fallback case
    it('returns a fallback', () => {
        expect(getEnvVar('NON_EXISTENT_KEY', 'fallback')).toBe('fallback')
    })

    // test that all keys are consistently found
    it('returns all keys found', () => {
        for (const key in keys) {
            expect(getEnvVar(key)).toEqual(keys[key])
        }
    })

    // test that an error is thrown if key is not found
    it('throws an error if key is not found', () => {
        expect(() => getEnvVar('NON_EXISTENT_KEY')).toThrowError()
    })

    // test that *_ENDPOINT keys are validated as IPv4 addresses like *_IP keys
    it('validates *_ENDPOINT keys as IPv4', () => {
        expect(getEnvVar('UNSET_TEST_ENDPOINT', '127.0.0.1')).toBe('127.0.0.1')
        expect(() => getEnvVar('UNSET_TEST_ENDPOINT', 'not-an-ip')).toThrowError()
    })

    // test the deprecated alias lookup used in src/keys.ts
    it('falls back to the deprecated OLLAMA_IP / OLLAMA_PORT aliases', () => {
        const saved = { LLM_ENDPOINT: process.env.LLM_ENDPOINT, LLM_PORT: process.env.LLM_PORT }
        delete process.env.LLM_ENDPOINT
        delete process.env.LLM_PORT
        process.env.OLLAMA_IP = '10.0.0.5'
        process.env.OLLAMA_PORT = '17434'
        try {
            expect(getEnvVar('LLM_ENDPOINT', process.env.OLLAMA_IP ?? '127.0.0.1')).toBe('10.0.0.5')
            expect(getEnvVar('LLM_PORT', process.env.OLLAMA_PORT ?? '11434')).toBe('17434')
        } finally {
            delete process.env.OLLAMA_IP
            delete process.env.OLLAMA_PORT
            if (saved.LLM_ENDPOINT !== undefined) process.env.LLM_ENDPOINT = saved.LLM_ENDPOINT
            if (saved.LLM_PORT !== undefined) process.env.LLM_PORT = saved.LLM_PORT
        }
    })
})
