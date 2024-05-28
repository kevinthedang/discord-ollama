import { describe, expect, it } from 'vitest';
import { clean } from '../src/utils/mentionClean';
import keys from '../src/keys';

/**
 * MentionClean test suite, tests the clean function
 * 
 * @param name name of the test suite
 * @param fn function holding tests to run
 */
describe('#clean', () => {
    // test for id removal from message
    it('removes the mention from a message', () => {
        const message = `<@${keys.clientUid}> Hello, World!`;
        expect(clean(message)).toBe('Hello, World!');
    });
});