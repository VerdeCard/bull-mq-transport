import { Injectable } from '@nestjs/common';
import {
  IBullMqModuleOptions,
  IBullMqModuleOptionsFactory,
} from '@xdave/bull-mq-transport';

@Injectable()
export class ExampleBullMqConfigService implements IBullMqModuleOptionsFactory {
  constructor() { }

  createModuleOptions(): IBullMqModuleOptions {
    return {
      connection: {
        host: 'localhost',
        port: 6379,
      },
      // logExceptionsAsLevel: 'warn',
    };
  }
}
