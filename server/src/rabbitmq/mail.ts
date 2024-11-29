import { sendMail, SendMailType } from "@/utils/nodemailer";
import { Amqp } from "./connect";

const sendEmailQueue = "sendEmailQueue";

export async function sendEmailListener() {
  const channel = await Amqp.conn.createChannel();
  await channel.assertQueue(sendEmailQueue, { durable: true });
  await channel.consume(
    sendEmailQueue,
    async (msg) => {
      if (msg) {
        const data = JSON.parse(msg.content.toString()) as SendMailType;
        const sended = await sendMail(data);
        if (!sended) {
          console.log(
            `sendEmailListener method error. Hint: sendMail() method error because refresh token expires`
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

export async function sendEmailProducer(message: SendMailType) {
  const channel = await Amqp.conn.createChannel();
  await channel.assertQueue(sendEmailQueue, {
    durable: true,
  });
  await channel.sendToQueue(
    sendEmailQueue,
    Buffer.from(JSON.stringify(message)),
    {
      persistent: true,
    }
  );
  await channel.close();
}
