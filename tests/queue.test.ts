import { describe, expect, it } from 'vitest'
import { Queue } from '../src/components/index.js'

/**
 * Queue test suite, tests the Queue class
 * 
 * @param name name of the test suite
 * @param fn function holding tests to run
 */
describe('Queue Structure', () => {
    let queue = new Queue<string>()

    // test for queue creation
    it('creates a new queue', () => {
        expect(queue).not.toBeNull()
    })

    // test for queue capacity creation
    it('adds specific capacity to the queue', () => {
        queue = new Queue<string>(2)
        expect(queue).not.toBeNull()
    })

    // test for enqueue success, size update
    it('adds items to the queue', () => {
        queue.enqueue('hello')
        expect(queue.size()).toBe(1)
    })

    // test for multiple enqueue success, size update
    it('adds multiple items to the queue', () => {
        queue.enqueue('world')
        expect(queue.size()).toBe(2)
    })

    // test for enqueue failure upon capacity overflow
    it('throws an error when the queue is full', () => {
        expect(() => queue.enqueue('!')).toThrowError()
    })

    // test for getItems success
    it('returns all items in the queue', () => {
        expect(queue.getItems()).toEqual(['hello', 'world'])
    })

    // test for pop success, size update
    it('removes an item from the front of the queue', () => {
        queue.pop()
        expect(queue.size() && queue.getItems()[0]).toBe(1 && 'hello')
    })

    // test for dequeue success, size update
    it('removes an item from the back of the queue', () => {
        queue.dequeue()
        expect(queue.size() && queue.getItems()[0]).toBe(0 && 'world')
    })

    // test for getItems success with nothing in the list
    it('returns an empty array when the queue is empty', () => {
        expect(queue.getItems()).toEqual([])
    })
})