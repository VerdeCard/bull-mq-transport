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
exports.BullMqClient = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const uuid_1 = require("uuid");
const bull_mq_constants_1 = require("../constants/bull-mq.constants");
const queue_events_factory_1 = require("../factories/queue-events.factory");
const queue_factory_1 = require("../factories/queue.factory");
let BullMqClient = exports.BullMqClient = class BullMqClient extends microservices_1.ClientProxy {
    constructor(options, queueFactory, queueEventsFactory) {
        super();
        this.options = options;
        this.queueFactory = queueFactory;
        this.queueEventsFactory = queueEventsFactory;
    }
    async connect() {
        return;
    }
    async close() {
        return;
    }
    publish(packet, callback) {
        var _a;
        const queue = this.getQueue(packet.pattern);
        const events = this.queueEventsFactory.create(packet.pattern, {
            connection: this.options.connection,
        });
        events.on('completed', (job) => callback({
            response: job.returnvalue,
            isDisposed: true,
        }));
        events.on('failed', async (jobInfo) => {
            var _a;
            const job = await queue.getJob(jobInfo.jobId);
            const err = new microservices_1.RpcException(jobInfo.failedReason);
            err.stack = (_a = job === null || job === void 0 ? void 0 : job.stacktrace) === null || _a === void 0 ? void 0 : _a[0];
            callback({
                err,
                isDisposed: true,
            });
        });
        queue
            .add(packet.pattern, packet.data, {
            jobId: (_a = packet.data.id) !== null && _a !== void 0 ? _a : (0, uuid_1.v4)(),
            ...packet.data.options,
        })
            .then(async (job) => {
            try {
                await job.waitUntilFinished(events);
            }
            catch {
                // BullMq unnecessarily re-throws the error we're handling in
                // waitUntilFinished(), so we ignore that here.
            }
            finally {
                await events.close();
                await queue.close();
            }
        });
        return () => void 0;
    }
    async dispatchEvent(packet) {
        var _a;
        const queue = this.getQueue(packet.pattern);
        await queue.add(packet.pattern, packet.data, {
            jobId: (_a = packet.data.id) !== null && _a !== void 0 ? _a : (0, uuid_1.v4)(),
            ...packet.data.options,
        });
        await queue.close();
    }
    getQueue(pattern) {
        const queue = this.queueFactory.create(pattern, {
            connection: this.options.connection,
            sharedConnection: true,
        });
        return queue;
    }
};
exports.BullMqClient = BullMqClient = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(bull_mq_constants_1.BULLMQ_MODULE_OPTIONS)),
    __metadata("design:paramtypes", [Object, queue_factory_1.QueueFactory,
        queue_events_factory_1.QueueEventsFactory])
], BullMqClient);
//# sourceMappingURL=bull-mq.client.js.map