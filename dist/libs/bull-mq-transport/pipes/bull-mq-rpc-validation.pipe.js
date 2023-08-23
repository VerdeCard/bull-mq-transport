"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BullMqRpcValidationPipe = void 0;
const common_1 = require("@nestjs/common");
const bull_mq_rpc_validation_exception_1 = require("../exceptions/bull-mq-rpc-validation.exception");
class BullMqRpcValidationPipe extends common_1.ValidationPipe {
    constructor(options) {
        super({
            exceptionFactory: (errors) => {
                return new bull_mq_rpc_validation_exception_1.BullMqRpcValidationException(errors.toString());
            },
            ...options,
        });
    }
}
exports.BullMqRpcValidationPipe = BullMqRpcValidationPipe;
//# sourceMappingURL=bull-mq-rpc-validation.pipe.js.map