import { Queue } from '../src/queues/queue';
import { describe, expect, it } from 'vitest';

describe('#QueueConstructor', () => {
    it('creates a new default queue', () => {
        const queue = new Queue<string>();
        expect(queue.size()).toBe(0);
    });

    it('creates a new queue with a capacity', () => {
        const queue = new Queue<string>(3);
        expect(queue.size()).toBe(0);
    });
});

describe('#QueueEnqueue', () => {
    it('adds an item to the queue', () => {
        const queue = new Queue<string>();
        queue.enqueue('hello');
        expect(queue.size()).toBe(1);
    });

    it('adds multiple items to the queue', () => {
        const queue = new Queue<string>();
        queue.enqueue('hello');
        queue.enqueue('world');
        expect(queue.size()).toBe(2);
    });

    it('throws an error when the queue is full', () => {
        const queue = new Queue<string>(1);
        queue.enqueue('hello');
        expect(() => queue.enqueue('world')).toThrowError();
    });
});

describe('#QueueDequeue', () => {
    it('removes an item from the queue', () => {
        const queue = new Queue<string>();
        queue.enqueue('hello');
        expect(queue.dequeue()).toBe('hello');
        expect(queue.size()).toBe(0);
    });

    it('removes multiple items from the queue', () => {
        const queue = new Queue<string>();
        queue.enqueue('hello');
        queue.enqueue('world');
        expect(queue.dequeue()).toBe('hello');
        expect(queue.dequeue()).toBe('world');
        expect(queue.size()).toBe(0);
    });

    it('returns undefined when the queue is empty', () => {
        const queue = new Queue<string>();
        expect(queue.dequeue()).toBeUndefined();
    });
});

describe('#QueueSize', () => {
    it('returns the size of the queue', () => {
        const queue = new Queue<string>();
        queue.enqueue('hello');
        expect(queue.size()).toBe(1);
    });

    it('returns the size of the queue after multiple items', () => {
        const queue = new Queue<string>();
        queue.enqueue('hello');
        queue.enqueue('world');
        expect(queue.size()).toBe(2);
    });

    it('returns 0 when the queue is empty', () => {
        const queue = new Queue<string>();
        expect(queue.size()).toBe(0);
    });
});

describe('#QueuePop', () => {
    it('removes the front of the queue', () => {
        const queue = new Queue<string>();
        queue.enqueue('hello');
        queue.enqueue('world');
        queue.pop();
        expect(queue.size()).toBe(1);
    });

    it('removes the front of the queue multiple times', () => {
        const queue = new Queue<string>();
        queue.enqueue('hello');
        queue.enqueue('world');
        queue.pop();
        queue.pop();
        expect(queue.size()).toBe(0);
    });
});

describe('#QueueGetItems', () => {
    it('returnss the items in the queue', () => {
        const queue = new Queue<string>();
        queue.enqueue('hello');
        queue.enqueue('world');
        expect(queue.getItems()).toEqual(['hello', 'world']);
    });

    it('returns the items in the queue after removing an item', () => {
        const queue = new Queue<string>();
        queue.enqueue('hello');
        queue.enqueue('world');
        queue.dequeue();
        expect(queue.getItems()).toEqual(['world']);
    });

    it('returns an empty array when the queue is empty', () => {
        const queue = new Queue<string>();
        expect(queue.getItems()).toEqual([]);
    });
});