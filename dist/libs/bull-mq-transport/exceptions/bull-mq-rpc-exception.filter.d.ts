import { ArgumentsHost, RpcExceptionFilter } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { RpcException } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { IBullMqModuleOptions } from '../interfaces/bull-mq-module-options.interface';
export declare class BullMqRpcExceptionFilter extends BaseExceptionFilter implements RpcExceptionFilter<RpcException> {
    private readonly options;
    private readonly logger;
    constructor(options: IBullMqModuleOptions);
    catch(exception: RpcException, host: ArgumentsHost): Observable<void>;
    logException(exception: Error, host: ArgumentsHost): void;
}
