import { RpcException } from '@nestjs/microservices';
export declare class BullMqRpcValidationException extends RpcException {
    name: string;
}
