import { describe, expect, it } from 'vitest'
import { clean } from '../src/utils/index.js'

// Sample UID for testing
const sampleId = '123456789'

/**
 * MentionClean test suite, tests the clean function
 * 
 * @param name name of the test suite
 * @param fn function holding tests to run
 */
describe('Mentions Cleaned', () => {
    // test for id removal from message
    it('removes the mention from a message', () => {
        const message = `<@${sampleId}> Hello, World!`
        expect(clean(message, sampleId)).toBe('Hello, World!')
    })
})