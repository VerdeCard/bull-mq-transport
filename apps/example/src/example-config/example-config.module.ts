import { Module } from '@nestjs/common';
import { BullMqModule } from '../../../../libs/bull-mq-transport/src';
import { ExampleBullMqConfigService } from './example-bull-mq-config.service';
// import { ExampleRedisConfigService } from './example-redis-config.service';

@Module({
  imports: [
    BullMqModule.forRoot({
      connection: { host: 'localhost', port: 6379 },
      // connection: ioRedisConnection
    }),
  ],
  providers: [ExampleBullMqConfigService],
  exports: [ExampleBullMqConfigService],
})
export class ExampleConfigModule { }
