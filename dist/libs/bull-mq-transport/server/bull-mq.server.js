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
exports.BullMqServer = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const bull_mq_constants_1 = require("../constants/bull-mq.constants");
const worker_factory_1 = require("../factories/worker.factory");
let BullMqServer = exports.BullMqServer = class BullMqServer extends microservices_1.Server {
    constructor(options, workerFactory) {
        super();
        this.options = options;
        this.workerFactory = workerFactory;
        this.transportId = microservices_1.Transport.REDIS;
        this.logger = new common_1.Logger(this.constructor.name);
        this.workers = new Map();
        this.initializeSerializer(this.serializer);
        this.initializeDeserializer(this.deserializer);
    }
    async listen(callback) {
        for (const [pattern, handler] of this.messageHandlers) {
            if (pattern && handler && !this.workers.has(pattern)) {
                const worker = this.workerFactory.create(pattern, (job) => {
                    return new Promise(async (resolve, reject) => {
                        const stream$ = this.transformToObservable(await handler(job.data, job));
                        this.send(stream$, (packet) => {
                            if (packet.err) {
                                return reject(packet.err);
                            }
                            resolve(packet.response);
                        });
                    });
                }, {
                    ...this.options,
                    sharedConnection: true,
                });
                await worker.startStalledCheckTimer();
                this.workers.set(pattern, worker);
                this.logger.log(`Registered queue "${pattern}"`);
            }
        }
        callback();
    }
    async close() {
        for (const worker of this.workers.values()) {
            await worker.close();
        }
    }
};
exports.BullMqServer = BullMqServer = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(bull_mq_constants_1.BULLMQ_MODULE_OPTIONS)),
    __metadata("design:paramtypes", [Object, worker_factory_1.WorkerFactory])
], BullMqServer);
//# sourceMappingURL=bull-mq.server.js.map