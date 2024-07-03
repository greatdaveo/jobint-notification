import 'express-async-errors';
import http from 'http';

import { winstonLogger } from '@greatdaveo/jobint-shared'; // The jobint-shared library
import { Logger } from 'winston';
import { config } from '@notifications/config';
import { Application } from 'express';

const SERVER_PORT = 4001;

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationServer', 'debug');

// This function will be called inside app.ts file
export function start(app: Application): void {
  startServer(app);
  startQueues();
  startElasticSearch();
}

// The function to add the queues to
async function startQueues(): Promise<void> {}

function startElasticSearch(): void {}

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
