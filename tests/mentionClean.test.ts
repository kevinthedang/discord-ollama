import { describe, expect, it } from 'vitest'
import { clean } from '../src/utils/mentionClean'
import { getEnvVar } from '../src/utils'

/**
 * MentionClean test suite, tests the clean function
 * 
 * @param name name of the test suite
 * @param fn function holding tests to run
 */
describe('Mentions Cleaned', () => {
    // test for id removal from message
    it('removes the mention from a message', () => {
        const message = `<@${getEnvVar('CLIENT_UID')}> Hello, World!`
        expect(clean(message)).toBe('Hello, World!')
    })
})