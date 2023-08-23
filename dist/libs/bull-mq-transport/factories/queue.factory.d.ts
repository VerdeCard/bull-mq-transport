import { Queue, QueueOptions } from 'bullmq';
export declare class QueueFactory {
    create(name: string, options?: QueueOptions): Queue;
}
