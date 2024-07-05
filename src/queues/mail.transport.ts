import { IEmailLocals, winstonLogger } from '@greatdaveo/jobint-shared';
import { config } from '@notifications/config';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'mailTransport', 'debug');

async function sendEmail(template: string, receiverEmail: string, locals: IEmailLocals): Promise<void> {
  try {
    // To set the email template
    log.info('Email sent successfully!');
  } catch (error) {
    log.log('error', 'NotificationService MailTransport sendEmail() method error: ', error);
  }
}

export { sendEmail };
