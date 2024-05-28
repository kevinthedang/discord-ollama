import { describe, expect, it } from 'vitest';
import { getEnvVar } from '../src/utils';
import keys from '../src/keys';

/**
 * getEnvVar test suite, tests the getEnvVar function
 * 
 * @param name name of the test suite
 * @param fn function holding tests to run
 */
describe('#getEnvVar', () => {
    // list of keys to test for
    const keychain = [
        { "clientToken": "CLIENT_TOKEN" },
        { "channel": "CHANNEL_ID" },
        { "model": "MODEL" },
        { "clientUid": "CLIENT_UID" },
        { "guildId": "GUILD_ID" },
        { "ipAddress": "OLLAMA_IP" },
        { "portAddress": "OLLAMA_PORT" }
    ];

    // test for non-empty string
    it('returns a non-empty string', () => {
        expect(getEnvVar('CLIENT_TOKEN')).not.toBe('');
    });

    // test for string type
    it('returns a string', () => {
        expect(typeof getEnvVar('CLIENT_TOKEN')).toBe('string');
    });

    // test for distinct key
    it('returns a string distinct key', () => {
        expect(getEnvVar('CLIENT_TOKEN')).toEqual(keys.clientToken);
    });

    // test for fallback case
    it('returns a fallback', () => {
        expect(getEnvVar('NON_EXISTENT_KEY', 'fallback')).toBe('fallback');
    });

    // test that all keys are consistently found
    it('returns all keys found', () => {
        keychain.forEach(key => {
            const keyName = Object.keys(key)[0];
            expect(getEnvVar(key[keyName])).toEqual(keys[keyName]);
        });
    });

    // test that an error is thrown if key is not found
    it('throws an error if key is not found', () => {
        expect(() => getEnvVar('NON_EXISTENT_KEY')).toThrowError();
    });
});
