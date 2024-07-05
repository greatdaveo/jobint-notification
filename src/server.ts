import 'express-async-errors';
import http from 'http';

// import { IEmailMessageDetails, winstonLogger } from '@greatdaveo/jobint-shared'; // The jobint-shared library
import { winstonLogger } from '@greatdaveo/jobint-shared'; // The jobint-shared library
import { Logger } from 'winston';
import { config } from '@notifications/config';
import { Application } from 'express';
import { healthRoutes } from '@notifications/routes';
import { checkConnection } from '@notifications/elasticsearch';
import { createConnection } from '@notifications/queues/connection';
import { consumeAuthEmailMessages, consumeOrderEmailMessages } from '@notifications/queues/email.consumer';
import { Channel } from 'amqplib';

const SERVER_PORT = 4001;

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationServer', 'debug');

// This function will be called inside app.ts file
export function start(app: Application): void {
  startServer(app);
  //   To use the router
  app.use('', healthRoutes);

  startQueues();
  startElasticSearch();
}

// The function to add the queues to
async function startQueues(): Promise<void> {
  const emailChannel: Channel = (await createConnection()) as Channel;
  // To consume the messages
  await consumeAuthEmailMessages(emailChannel);
  await consumeOrderEmailMessages(emailChannel);

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
}

// This function will start the elastic search
function startElasticSearch(): void {
  checkConnection();
}

function startServer(app: Application): void {
  try {
    const httpServer: http.Server = new http.Server(app);
    log.info(`Worker with process id of ${process.pid} on notification server has started!`);

    httpServer.listen(SERVER_PORT, () => {
      log.info(`Notification server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log('error', 'NotificationService startServer() method: ', error); // To send log msgs to elastic search
  }
}
