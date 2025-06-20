// Queue interfaces for any queue class to follow
interface IQueue<T> {
    enqueue(item: T): void
    dequeue(): T | undefined
    size(): number
}

/**
 * Queue for UserMessages
 *      When the limit for messages is met, we want to clear
 *      out the oldest message in the queue
 */
export class Queue<T> implements IQueue<T> {
    private storage: T[] = []

    /**
     * Set up Queue
     * @param capacity max length of queue
     */
    constructor(public capacity: number = 5) { }

    /**
     * Put item in front of queue
     * @param item object of type T to add into queue
     */
    enqueue(item: T): void {
        if (this.size() === this.capacity)
            throw Error('Queue has reached max capacity, you cannot add more items.')
        this.storage.push(item)
    }

    /**
     * Remove item at end of queue
     * @returns object of type T in queue
     */
    dequeue(): T | undefined {
        return this.storage.shift()
    }

    /**
     * Size of the queue
     * @returns length of queue as a int/number
     */
    size(): number {
        return this.storage.length
    }

    /**
     * Remove the front of the queue, typically for errors
     */
    pop(): void {
        this.storage.pop()
    }

    /**
     * Get the queue as an array
     * @returns a array of T items
     */
    getItems(): T[] {
        return this.storage
    }

    /**
     * Set a new queue to modify
     * @param newQueue new queue of T[] to modify
     */
    setQueue(newQueue: T[]): void {
        this.storage = newQueue
    }
}