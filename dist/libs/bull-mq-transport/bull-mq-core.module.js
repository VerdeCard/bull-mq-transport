"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var BullMqCoreModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BullMqCoreModule = void 0;
const common_1 = require("@nestjs/common");
const bull_mq_client_1 = require("./client/bull-mq.client");
const bull_mq_constants_1 = require("./constants/bull-mq.constants");
const queue_events_factory_1 = require("./factories/queue-events.factory");
const queue_factory_1 = require("./factories/queue.factory");
const worker_factory_1 = require("./factories/worker.factory");
const bull_mq_server_1 = require("./server/bull-mq.server");
let BullMqCoreModule = exports.BullMqCoreModule = BullMqCoreModule_1 = class BullMqCoreModule {
    static forRoot(options) {
        return {
            module: BullMqCoreModule_1,
            global: true,
            providers: [
                { provide: bull_mq_constants_1.BULLMQ_MODULE_OPTIONS, useValue: options },
                queue_factory_1.QueueFactory,
                queue_events_factory_1.QueueEventsFactory,
                worker_factory_1.WorkerFactory,
                bull_mq_server_1.BullMqServer,
                bull_mq_client_1.BullMqClient,
            ],
            exports: [bull_mq_server_1.BullMqServer, bull_mq_client_1.BullMqClient, bull_mq_constants_1.BULLMQ_MODULE_OPTIONS],
        };
    }
    static forRootAsync(options) {
        var _a, _b;
        return {
            module: BullMqCoreModule_1,
            global: true,
            imports: (_a = options.imports) !== null && _a !== void 0 ? _a : [],
            providers: [
                ...((_b = options.providers) !== null && _b !== void 0 ? _b : []),
                ...this.createAsyncProviders(options),
                queue_factory_1.QueueFactory,
                queue_events_factory_1.QueueEventsFactory,
                worker_factory_1.WorkerFactory,
                bull_mq_server_1.BullMqServer,
                bull_mq_client_1.BullMqClient,
            ],
            exports: [bull_mq_server_1.BullMqServer, bull_mq_client_1.BullMqClient, bull_mq_constants_1.BULLMQ_MODULE_OPTIONS],
        };
    }
    static createAsyncProviders(options) {
        var _a;
        if ((_a = options.useExisting) !== null && _a !== void 0 ? _a : options.useFactory) {
            return [this.createAsyncOptionsProvider(options)];
        }
        if (options.useClass) {
            return [
                this.createAsyncOptionsProvider(options),
                { provide: options.useClass, useClass: options.useClass },
            ];
        }
        throw new Error('Invalid BullMqModule async options: one of `useClass`, `useExisting` or `useFactory` should be defined.');
    }
    static createAsyncOptionsProvider(options) {
        var _a, _b, _c;
        if (options.useFactory) {
            return {
                provide: bull_mq_constants_1.BULLMQ_MODULE_OPTIONS,
                useFactory: options.useFactory,
                inject: (_a = options.inject) !== null && _a !== void 0 ? _a : [],
            };
        }
        const inject = [];
        if ((_b = options.useClass) !== null && _b !== void 0 ? _b : options.useExisting) {
            inject.push((_c = options.useClass) !== null && _c !== void 0 ? _c : options.useExisting);
        }
        return {
            provide: bull_mq_constants_1.BULLMQ_MODULE_OPTIONS,
            useFactory: async (optionsFactory) => await optionsFactory.createModuleOptions(),
            inject,
        };
    }
};
exports.BullMqCoreModule = BullMqCoreModule = BullMqCoreModule_1 = __decorate([
    (0, common_1.Module)({})
], BullMqCoreModule);
//# sourceMappingURL=bull-mq-core.module.js.map