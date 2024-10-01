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
})
