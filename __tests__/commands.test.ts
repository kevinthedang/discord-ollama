import commands from '../src/commands';
import { describe, expect, it } from 'vitest';

describe('#commands', () => {
    it('references defined object', () => {
        expect(typeof commands).toBe('object');
    });

    it('references specific commands', () => {
        const commandsString = commands.map(e => e.name).join(', ');
        expect(commandsString).toBe('thread, message-style, message-stream, toggle-chat, shutoff, modify-capacity');
    });
});