import { Test } from '@nestjs/testing';
import { Worker } from 'bullmq';
import { of } from 'rxjs';
import { IBullMqModuleOptions, WorkerFactory } from '../';
import {
  Mock,
  createMockFromClass,
  createMockProviders,
} from '../../test/nest-test-helpers';
import { BULLMQ_MODULE_OPTIONS } from '../constants';
import { BullMqServer } from './bull-mq.server';

describe('BullMqServer', () => {
  let server: BullMqServer;
  let workerFactory: Mock<WorkerFactory>;
  let worker: Mock<Worker>;

  const bullMQModuleOptions: IBullMqModuleOptions = {
    connection: { host: '', port: 1111 },
    concurrency: 5,
    sharedConnection: true,
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: BULLMQ_MODULE_OPTIONS,
          useValue: bullMQModuleOptions,
        },
        ...createMockProviders(WorkerFactory),
        BullMqServer,
      ],
    }).compile();

    server = module.get(BullMqServer);
    workerFactory = module.get(WorkerFactory);
  });

  beforeEach(async () => {
    worker = createMockFromClass(Worker);

    workerFactory.create.mockReturnValue(worker);
  });

  afterEach(async () => {
    await server.close();
  });

  it('should be defined', () => {
    expect(server).toBeDefined();
    expect(workerFactory).toBeDefined();
    expect(worker).toBeDefined();
  });

  it('creates QueueSchedulers & Workers for the handlers when listening', () => {
    const handlerSpy = jest.fn(async () => of(undefined));
    const callback = jest.fn();
    server.addHandler('test', handlerSpy, true);
    server.listen(callback);
    expect(workerFactory.create).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should be able to transmit worker options when using the worker factory', () => {
    const handlerSpy = jest.fn(async () => of(undefined));
    const callback = jest.fn();
    server.addHandler('test', handlerSpy, true);
    server.listen(callback);
    expect(workerFactory.create).toHaveBeenCalledWith(
      'test',
      expect.any(Function),
      bullMQModuleOptions,
    );
  });

  it('closes the QueueSchedulers & Workers when closing the server', async () => {
    const handlerSpy = jest.fn(async () => of(undefined));
    const callback = jest.fn();
    server.addHandler('test', handlerSpy, true);
    server.listen(callback);
    await server.close();
    expect(worker.close).toHaveBeenCalledTimes(1);
  });
});
