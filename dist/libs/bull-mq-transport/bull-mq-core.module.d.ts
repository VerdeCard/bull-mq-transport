import { DynamicModule } from '@nestjs/common';
import { IBullMqModuleOptionsAsync } from './interfaces/bull-mq-module-options-async.interface';
import { IBullMqModuleOptions } from './interfaces/bull-mq-module-options.interface';
export declare class BullMqCoreModule {
    static forRoot(options: IBullMqModuleOptions): DynamicModule;
    static forRootAsync(options: IBullMqModuleOptionsAsync): DynamicModule;
    private static createAsyncProviders;
    private static createAsyncOptionsProvider;
}
