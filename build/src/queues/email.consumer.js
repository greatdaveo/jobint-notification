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
Object.defineProperty(exports, "__esModule", { value: true });
exports.consumeAuthEmailMessages = consumeAuthEmailMessages;
exports.consumeOrderEmailMessages = consumeOrderEmailMessages;
const config_1 = require("@notifications/config");
const jobint_shared_1 = require("@greatdaveo/jobint-shared");
const connection_1 = require("@notifications/queues/connection");
const mail_transport_1 = require("@notifications/queues/mail.transport");
const log = (0, jobint_shared_1.winstonLogger)(`${config_1.config.ELASTIC_SEARCH_URL}`, 'emailConsumer', 'debug'); // To create a logger instance with specific configuration
function consumeAuthEmailMessages(channel) {
    return __awaiter(this, void 0, void 0, function* () {
        // To define an async function to consume authentication email messages
        try {
            if (!channel) {
                // To check if the channel is not provided
                channel = (yield (0, connection_1.createConnection)()); // To create a new channel if not provided
            }
            const exchangeName = 'jobint-email-notification'; // To define the name of the exchange
            const routingKey = 'auth-email'; // To define the routing key for the messages
            const queueName = 'auth-email-queue'; // To define the name of the queue
            yield channel.assertExchange(exchangeName, 'direct'); // To assert (declare) the exchange with type 'direct'
            const jobintQueue = yield channel.assertQueue(queueName, { durable: true, autoDelete: false }); // To assert (declare) the queue with durability and no auto-deletion
            yield channel.bindQueue(jobintQueue.queue, exchangeName, routingKey); // To bind the queue to the exchange with the routing key
            channel.consume(jobintQueue.queue, (msg) => __awaiter(this, void 0, void 0, function* () {
                // To consume messages from the queue
                // console.log(JSON.parse(msg!.content.toString())); // To log the message content after parsing it as JSON
                const { receiverEmail, username, verifyLink, resetLink, template } = JSON.parse(msg.content.toString());
                // These are properties that will be displayed in the email
                const locals = {
                    appLink: `${config_1.config.CLIENT_URL}`,
                    appIcon: 'https://i.ibb.co/vZsVqYS/Job-Int-App-Logo.png',
                    username,
                    verifyLink,
                    resetLink
                };
                // To send emails (placeholder for email sending logic)
                yield (0, mail_transport_1.sendEmail)(template, receiverEmail, locals);
                // To acknowledge (placeholder for message acknowledgment logic)
                channel.ack(msg);
            }));
        }
        catch (error) {
            log.log('error', 'NotificationService EmailConsumer consumeAuthEmailMessages() method error: ', error);
        }
    });
}
function consumeOrderEmailMessages(channel) {
    return __awaiter(this, void 0, void 0, function* () {
        // To define an async function to consume authentication email messages
        try {
            if (!channel) {
                // To check if the channel is not provided
                channel = (yield (0, connection_1.createConnection)()); // To create a new channel if not provided
            }
            const exchangeName = 'jobint-order-notification'; // To define the name of the exchange
            const routingKey = 'order-email'; // To define the routing key for the messages
            const queueName = 'order-email-queue'; // To define the name of the queue
            yield channel.assertExchange(exchangeName, 'direct'); // To assert (declare) the exchange with type 'direct'
            const jobintQueue = yield channel.assertQueue(queueName, { durable: true, autoDelete: false }); // To assert (declare) the queue with durability and no auto-deletion
            yield channel.bindQueue(jobintQueue.queue, exchangeName, routingKey); // To bind the queue to the exchange with the routing key
            channel.consume(jobintQueue.queue, (msg) => __awaiter(this, void 0, void 0, function* () {
                // To consume messages from the queue
                // console.log(JSON.parse(msg!.content.toString())); // To log the message content after parsing it as JSON
                const { receiverEmail, template, sender, offerLink, amount, buyerUsername, sellerUsername, title, description, deliveryDays, orderId, orderDue, requirements, orderUrl, originalDate, newDate, reason, subject, header, type, message, serviceFee, total, username, verifyLink, resetLink } = JSON.parse(msg.content.toString());
                // To set up the locals to be displayed on the email template
                const locals = {
                    appLink: `${config_1.config.CLIENT_URL}`,
                    appIcon: 'https://i.ibb.co/vZsVqYS/Job-Int-App-Logo.png',
                    sender,
                    offerLink,
                    amount,
                    buyerUsername,
                    sellerUsername,
                    title,
                    description,
                    deliveryDays,
                    orderId,
                    orderDue,
                    requirements,
                    orderUrl,
                    originalDate,
                    newDate,
                    reason,
                    subject,
                    header,
                    type,
                    message,
                    serviceFee,
                    total,
                    username,
                    verifyLink,
                    resetLink
                };
                // To send emails
                if (template === 'orderPlaced') {
                    yield (0, mail_transport_1.sendEmail)('orderPlaced', receiverEmail, locals);
                    yield (0, mail_transport_1.sendEmail)('orderReceipt', receiverEmail, locals);
                }
                else {
                    yield (0, mail_transport_1.sendEmail)(template, receiverEmail, locals);
                }
                // To acknowledge (placeholder for message acknowledgment logic)
                channel.ack(msg);
            }));
        }
        catch (error) {
            log.log('error', 'NotificationService EmailConsumer consumeOrderEmailMessages() method error: ', error);
        }
    });
}
//# sourceMappingURL=email.consumer.js.map