"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConnection = createConnection;
const config_1 = require("@notifications/config");
const jobint_shared_1 = require("@greatdaveo/jobint-shared");
const amqplib_1 = __importDefault(require("amqplib"));
const log = (0, jobint_shared_1.winstonLogger)(`${config_1.config.ELASTIC_SEARCH_URL}`, 'NotificationQueueConnection', 'debug');
function createConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connection = yield amqplib_1.default.connect(`${config_1.config.RABBITMQ_ENDPOINT}`);
            const channel = yield connection.createChannel();
            log.info(`Notification server connected to queue successfully...`);
            closeConnection(channel, connection);
            return channel;
        }
        catch (error) {
            log.log('error', 'NotificationService error createConnection() method: ', error);
            return undefined;
        }
    });
}
function closeConnection(channel, connection) {
    process.once('SIGINT', () => {
        channel.close();
        connection.close();
    });
}
//# sourceMappingURL=connection.js.map