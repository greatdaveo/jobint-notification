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
exports.start = start;
require("express-async-errors");
const http_1 = __importDefault(require("http"));
// import { IEmailMessageDetails, winstonLogger } from '@greatdaveo/jobint-shared'; // The jobint-shared library
const jobint_shared_1 = require("@greatdaveo/jobint-shared"); // The jobint-shared library
const config_1 = require("@notifications/config");
const routes_1 = require("@notifications/routes");
const elasticsearch_1 = require("@notifications/elasticsearch");
const connection_1 = require("@notifications/queues/connection");
const email_consumer_1 = require("@notifications/queues/email.consumer");
const SERVER_PORT = 4001;
const log = (0, jobint_shared_1.winstonLogger)(`${config_1.config.ELASTIC_SEARCH_URL}`, 'notificationServer', 'debug');
// This function will be called inside app.ts file
function start(app) {
    startServer(app);
    //   To use the router
    app.use('', routes_1.healthRoutes);
    startQueues();
    startElasticSearch();
}
// The function to add the queues to
function startQueues() {
    return __awaiter(this, void 0, void 0, function* () {
        const emailChannel = (yield (0, connection_1.createConnection)());
        // To consume the messages
        yield (0, email_consumer_1.consumeAuthEmailMessages)(emailChannel);
        yield (0, email_consumer_1.consumeOrderEmailMessages)(emailChannel);
        // // To use the sendEmail method
        // const verificationLink = `${config.CLIENT_URL}/confirm_email?v_token=12345fruidhfcvjd`;
        // const messageDetails: IEmailMessageDetails = {
        //   receiverEmail: `${config.SENDER_EMAIL}`,
        //   verifyLink: verificationLink,
        //   template: 'verifyEmail'
        // };
        // // For Jobint email exchange
        // await emailChannel.assertExchange('jobint-email-notification', 'direct');
        // const message = JSON.stringify(messageDetails);
        // emailChannel.publish('jobint-email-notification', 'auth-email', Buffer.from(message));
        // // For Jobint order exchange
        // await emailChannel.assertExchange('jobint-order-notification', 'direct');
        // const message1 = JSON.stringify({ name: 'jobint', service: 'order notification service' });
        // emailChannel.publish('jobint-order-notification', 'order-email', Buffer.from(message1));
    });
}
// This function will start the elastic search
function startElasticSearch() {
    (0, elasticsearch_1.checkConnection)();
}
function startServer(app) {
    try {
        const httpServer = new http_1.default.Server(app);
        log.info(`Worker with process id of ${process.pid} on notification server has started!`);
        httpServer.listen(SERVER_PORT, () => {
            log.info(`Notification server running on port ${SERVER_PORT}`);
        });
    }
    catch (error) {
        log.log('error', 'NotificationService startServer() method: ', error); // To send log msgs to elastic search
    }
}
//# sourceMappingURL=server.js.map