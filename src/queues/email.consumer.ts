import { config } from '@notifications/config'; 
import { winstonLogger } from '@greatdaveo/jobint-shared'; 
import { Channel, ConsumeMessage } from 'amqplib'; 
import { Logger } from 'winston'; 
import { createConnection } from '@notifications/queues/connection'; 

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'emailConsumer', 'debug'); // To create a logger instance with specific configuration

async function consumeAuthEmailMessages(channel: Channel): Promise<void> {
  // To define an async function to consume authentication email messages
  try {
    if (!channel) {
      // To check if the channel is not provided
      channel = (await createConnection()) as Channel; // To create a new channel if not provided
    }

    const exchangeName = 'jobint-email-notification'; // To define the name of the exchange
    const routingKey = 'auth-email'; // To define the routing key for the messages
    const queueName = 'auth-email-queue'; // To define the name of the queue

    await channel.assertExchange(exchangeName, 'direct'); // To assert (declare) the exchange with type 'direct'
    const jobintQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false }); // To assert (declare) the queue with durability and no auto-deletion
    await channel.bindQueue(jobintQueue.queue, exchangeName, routingKey); // To bind the queue to the exchange with the routing key
    channel.consume(jobintQueue.queue, async (msg: ConsumeMessage | null) => {
      // To consume messages from the queue
      console.log(JSON.parse(msg!.content.toString())); // To log the message content after parsing it as JSON
      // To send emails (placeholder for email sending logic)

      // To acknowledge (placeholder for message acknowledgment logic)
    });
  } catch (error) {
    log.log('error', 'NotificationService EmailConsumer consumeAuthEmailMessages() method error: ', error); 
  }
}

export { consumeAuthEmailMessages };