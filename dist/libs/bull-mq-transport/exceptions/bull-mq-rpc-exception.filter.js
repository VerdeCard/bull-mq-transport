"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BullMqRpcExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const rxjs_1 = require("rxjs");
const bull_mq_constants_1 = require("../constants/bull-mq.constants");
let BullMqRpcExceptionFilter = exports.BullMqRpcExceptionFilter = class BullMqRpcExceptionFilter extends core_1.BaseExceptionFilter {
    constructor(options) {
        super();
        this.options = options;
        this.logger = new common_1.Logger();
    }
    catch(exception, host) {
        if (host.getType() === 'http') {
            const err = new common_1.InternalServerErrorException(exception.message, exception.constructor.name);
            if (exception.stack) {
                err.stack = exception.stack;
            }
            this.logException(err, host);
            return (0, rxjs_1.of)(super.catch(err, host));
        }
        const err = {
            name: exception.name,
            error: exception.name,
            message: exception.message,
            stack: exception.stack || undefined,
        };
        this.logException(err, host);
        return (0, rxjs_1.throwError)(() => err);
    }
    logException(exception, host) {
        var _a;
        const defaultLogLevel = 'error';
        switch ((_a = this.options.logExceptionsAsLevel) !== null && _a !== void 0 ? _a : defaultLogLevel) {
            case 'off':
                return;
            case 'log':
                return this.logger.log(exception.stack, host.getType());
            case 'error':
                return this.logger.error(exception.message, exception.stack, host.getType());
            case 'warn':
                return this.logger.warn(exception.stack, host.getType());
            case 'debug':
                return this.logger.debug(exception.stack, host.getType());
            case 'verbose':
                return this.logger.verbose(exception.stack, host.getType());
        }
    }
};
exports.BullMqRpcExceptionFilter = BullMqRpcExceptionFilter = __decorate([
    (0, common_1.Catch)(microservices_1.RpcException),
    __param(0, (0, common_1.Inject)(bull_mq_constants_1.BULLMQ_MODULE_OPTIONS)),
    __metadata("design:paramtypes", [Object])
], BullMqRpcExceptionFilter);
//# sourceMappingURL=bull-mq-rpc-exception.filter.js.map