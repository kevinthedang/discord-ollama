import keys from '../src/keys';
import { getEnvVar } from '../src/utils';
import { describe, expect, it } from 'vitest';

describe('#getEnvVar', () => {
    const keychain = [
        { "clientToken": "CLIENT_TOKEN" },
        { "channel": "CHANNEL_ID" },
        { "model": "MODEL" },
        { "clientUid": "CLIENT_UID" },
        { "guildId": "GUILD_ID" },
        { "ipAddress": "OLLAMA_IP" },
        { "portAddress": "OLLAMA_PORT" }
    ];

    it('returns a non-empty string', () => {
        expect(getEnvVar('CLIENT_TOKEN')).not.toBe('');
    });

    it('returns a string', () => {
        expect(typeof getEnvVar('CLIENT_TOKEN')).toBe('string');
    });

    it('returns a string distinct key', () => {
        expect(getEnvVar('CLIENT_TOKEN')).toEqual(keys.clientToken);
    });

    it('returns a fallback', () => {
        expect(getEnvVar('NON_EXISTENT_KEY', 'fallback')).toBe('fallback');
    });

    it('returns all keys found', () => {
        keychain.forEach(key => {
            const keyName = Object.keys(key)[0];
            expect(getEnvVar(key[keyName])).toEqual(keys[keyName]);
        });
    });

    it('throws an error if key is not found', () => {
        expect(() => getEnvVar('NON_EXISTENT_KEY')).toThrowError();
    });
});
