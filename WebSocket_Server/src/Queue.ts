class QueueNode<T> {
  value: T;
  next: QueueNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

export class Queue<T> {
  private head: QueueNode<T> | null = null;
  private tail: QueueNode<T> | null = null;
  private length: number = 0;

  // Add an element to the queue (enqueue)
  enqueue(value: T): void {
    const newNode = new QueueNode(value);
    if (this.tail) {
      this.tail.next = newNode;
    }
    this.tail = newNode;
    if (!this.head) {
      this.head = newNode;
    }
    this.length++;
  }

  // Remove an element from the queue (dequeue)
  dequeue(): T | null {
    if (!this.head) {
      return null;
    }

    const value = this.head.value;
    this.head = this.head.next;

    if (!this.head) {
      this.tail = null;
    }

    this.length--;
    return value;
  }

  // Peek at the front element of the queue without removing it
  peek(): T | null {
    return this.head ? this.head.value : null;
  }

  // Check if the queue is empty
  isEmpty(): boolean {
    return this.length === 0;
  }

  // Get the size of the queue
  size(): number {
    return this.length;
  }
}
