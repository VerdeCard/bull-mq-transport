import { NestFactory } from '@nestjs/core';
import { BullMqServer } from 'verdecard/bull-mq-transport';
import { ExampleModule } from './example.module';

export const exampleBoostrap = async () => {
  const app = await NestFactory.create(ExampleModule);
  const options = { inheritAppConfig: true };
  const bullMqServer = app.get(BullMqServer);

  app.connectMicroservice({ strategy: bullMqServer }, options);
  await app.startAllMicroservices();

  await app.listen(3000);
};

exampleBoostrap().catch((err) => console.log(err));
