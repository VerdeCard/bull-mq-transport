import { Logger } from '@nestjs/common';
import { CustomTransportStrategy, Server, Transport } from '@nestjs/microservices';
import { Worker } from 'bullmq';
import { IBullMqModuleOptions } from '../';
import { WorkerFactory } from '../factories/worker.factory';
export declare class BullMqServer extends Server implements CustomTransportStrategy {
    private readonly options;
    private readonly workerFactory;
    transportId: Transport;
    protected readonly logger: Logger;
    protected readonly workers: Map<string, Worker<any, any, string>>;
    constructor(options: IBullMqModuleOptions, workerFactory: WorkerFactory);
    listen(callback: (...optionalParams: unknown[]) => void): Promise<void>;
    close(): Promise<void>;
}
