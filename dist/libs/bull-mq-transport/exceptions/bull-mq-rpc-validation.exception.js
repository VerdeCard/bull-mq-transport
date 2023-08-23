"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BullMqRpcValidationException = void 0;
const microservices_1 = require("@nestjs/microservices");
class BullMqRpcValidationException extends microservices_1.RpcException {
    constructor() {
        super(...arguments);
        this.name = this.constructor.name;
    }
}
exports.BullMqRpcValidationException = BullMqRpcValidationException;
//# sourceMappingURL=bull-mq-rpc-validation.exception.js.map