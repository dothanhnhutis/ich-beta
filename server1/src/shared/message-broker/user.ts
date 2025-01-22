import { Connection } from "amqplib";
import { sendMail, SendMailType } from "../utils/nodemailer";
import { Amqp } from "./connect";
import { MBInitConnectError } from "../utils/error-handler";
const sendEmailQueue = "sendEmailQueue";

export default class UserMessageBroker {
  conn: Connection;
  constructor() {
    if (!Amqp.conn) throw new MBInitConnectError();
    this.conn = Amqp.conn;
  }
  static async listener() {
    const userMB = new UserMessageBroker();
    await userMB.sendEmailVerificationListener();
  }

  async sendEmailVerificationListener() {
    const channel = await this.conn.createChannel();
    await channel.assertQueue(sendEmailQueue, { durable: true });
    await channel.consume(
      sendEmailQueue,
      async (msg) => {
        if (msg) {
          const data = JSON.parse(msg.content.toString()) as SendMailType;
          const sended = await sendMail(data);
          if (!sended) {
            console.log(
              `sendEmailVerificationListener method error. Hint: sendMail() method error because refresh token expires`
            );
          }
          channel.ack(msg);
        }
      },
      {
        noAck: false,
      }
    );
  }

  static async sendEmailProducer(message: SendMailType) {
    const userMB = new UserMessageBroker();
    const channel = await userMB.conn.createChannel();
    await channel.assertQueue(sendEmailQueue, {
      durable: true,
    });
    channel.sendToQueue(sendEmailQueue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
    await channel.close();
  }
}
