import amqplib, { type Connection } from "amqplib";
import { MBConnectError } from "../utils/error-handler";
export class Amqp {
  static conn: Connection | null = null;
  static async connect(url: string | amqplib.Options.Connect) {
    try {
      Amqp.conn = await amqplib.connect(url);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(`Connection to the RabbitMQ cluster failed: ${error}`);
        throw new MBConnectError();
      }
      throw error;
    }
  }
}
