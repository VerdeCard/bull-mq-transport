import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  CustomTransportStrategy,
  Server,
  Transport,
} from '@nestjs/microservices';
import { Job, Worker } from 'bullmq';
import { IBullMqModuleOptions } from '../';
import { BULLMQ_MODULE_OPTIONS } from '../constants/bull-mq.constants';
import { WorkerFactory } from '../factories/worker.factory';

@Injectable()
export class BullMqServer extends Server implements CustomTransportStrategy {
  transportId = Transport.REDIS;

  protected readonly logger = new Logger(this.constructor.name);
  protected readonly workers = new Map<string, Worker>();

  constructor(
    @Inject(BULLMQ_MODULE_OPTIONS)
    private readonly options: IBullMqModuleOptions,
    private readonly workerFactory: WorkerFactory,
  ) {
    super();

    this.initializeSerializer(this.serializer);
    this.initializeDeserializer(this.deserializer);
  }

  async listen(callback: (...optionalParams: unknown[]) => void) {
    for (const [pattern, handler] of this.messageHandlers) {
      if (pattern && handler && !this.workers.has(pattern)) {
        const worker = this.workerFactory.create(
          pattern,
          (job: Job) => {
            return new Promise<unknown>(async (resolve, reject) => {
              const stream$ = this.transformToObservable(
                await handler(job.data, job),
              );
              this.send(stream$, (packet) => {
                if (packet.err) {
                  return reject(packet.err);
                }
                resolve(packet.response);
              });
            });
          },
          {
            ...this.options,
            sharedConnection: true,
          },
        );
        await worker.startStalledCheckTimer();
        this.workers.set(pattern, worker);
        this.logger.log(`Registered queue "${pattern}"`);
      }
    }
    callback();
  }

  async close() {
    for (const worker of this.workers.values()) {
      await worker.close();
    }
  }
}
