import keys from '../src/keys';
import { clean } from '../src/utils/mentionClean';
import { describe, expect, it } from 'vitest';

describe('#clean', () => {
    it('removes the mention from a message', () => {
        const message = `<@${keys.clientUid}> Hello, World!`;
        expect(clean(message)).toBe('Hello, World!');
    });
});