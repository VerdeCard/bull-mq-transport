import { ClientProxy, ReadPacket, WritePacket } from '@nestjs/microservices';
import { Queue } from 'bullmq';
import { QueueEventsFactory } from '../factories/queue-events.factory';
import { QueueFactory } from '../factories/queue.factory';
import { IBullMqEvent } from '../interfaces/bull-mq-event.interface';
import { IBullMqModuleOptions } from '../interfaces/bull-mq-module-options.interface';
export declare class BullMqClient extends ClientProxy {
    private readonly options;
    private readonly queueFactory;
    private readonly queueEventsFactory;
    constructor(options: IBullMqModuleOptions, queueFactory: QueueFactory, queueEventsFactory: QueueEventsFactory);
    connect(): Promise<void>;
    close(): Promise<void>;
    protected publish(packet: ReadPacket<IBullMqEvent<any>>, callback: (packet: WritePacket<any>) => void): () => void;
    protected dispatchEvent(packet: ReadPacket<IBullMqEvent<any>>): Promise<any>;
    protected getQueue(pattern: any): Queue;
}
