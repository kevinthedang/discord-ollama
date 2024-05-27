import events from '../src/events';
import { describe, expect, it } from 'vitest';

describe('#events', () => {
    it('references defined object', () => {
        expect(typeof events).toBe('object');
    });

    it('references specific events', () => {
        const eventsString = events.map(e => e.key.toString()).join(', ');
        expect(eventsString).toBe('ready, messageCreate, interactionCreate');
    });
});