import { Processor, Worker, WorkerOptions } from 'bullmq';
export declare class WorkerFactory {
    create<T, R, N extends string>(name: string, processor?: string | Processor<T, R, N>, opts?: WorkerOptions): Worker<T, R, N>;
}
