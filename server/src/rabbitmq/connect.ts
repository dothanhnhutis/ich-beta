import amqplib, { type Connection } from "amqplib";
export class Amqp {
  static conn: Connection;
  constructor(private url: string | amqplib.Options.Connect) {}
  async connect() {
    try {
      Amqp.conn = await amqplib.connect(this.url);
    } catch (error: unknown) {
      throw new Error(`Connection to the RabbitMQ cluster failed: ${error}`);
    }
  }
}
