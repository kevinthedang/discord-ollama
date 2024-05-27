import { Queue } from '../src/queues/queue';
import { describe, expect, it } from 'vitest';

describe('#queue', () => {
    let queue= new Queue<string>();

    it('creates a new queue', () => {
        expect(queue).not.toBeNull();
    })

    it('adds specific capacity to the queue', () => {
        queue = new Queue<string>(2);
        expect(queue).not.toBeNull();
    });

    it('adds items to the queue', () => {
        queue.enqueue('hello');
        expect(queue.size()).toBe(1);
    });

    it('adds multiple items to the queue', () => {
        queue.enqueue('world');
        expect(queue.size()).toBe(2);
    });

    it('throws an error when the queue is full', () => {
        expect(() => queue.enqueue('!')).toThrowError();
    });

    it('returns all items in the queue', () => {
        expect(queue.getItems()).toEqual(['hello', 'world']);
    });

    it('returns the size of the queue', () => {
        expect(queue.size()).toBe(2);
    });

    it('removes an item from the front of the queue', () => {
        queue.pop();
        expect(queue.size() && queue.getItems()[0]).toBe(1 && 'hello');
    })

    it('removes an item from the back of the queue', () => {
        queue.dequeue();
        expect(queue.size() && queue.getItems()[0]).toBe(0 && 'world');
    });

    it('returns an empty array when the queue is empty', () => {
        expect(queue.getItems()).toEqual([]);
    });
});