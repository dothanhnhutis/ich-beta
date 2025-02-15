import http from "http";
import app from "./app";
import SocketServer from "./socket/init";
import { Server } from "socket.io";
import { departmentSocketListener } from "./socket/display";
import { initRedis } from "./redis/connection";
import { Amqp } from "./rabbitmq/connect";
import env from "./configs/env";
import { sendEmailListener } from "./rabbitmq/mail";
import { initWorker } from "./utils/bullmq";

const SERVER_PORT = 4000;

const startHttpServer = async (httpServer: http.Server) => {
  try {
    // redis cache
    initRedis();

    // queue BullMQ
    initWorker();

    // rabbitMQ
    const amqp = new Amqp(env.RABBITMQ_URL);
    await amqp.connect();
    await sendEmailListener();

    for (const s of ["SIGINT", "SIGTERM"]) {
      process.once(s, async () => {
        await Amqp.conn.close();
      });
    }

    console.log(`App server has started with process id ${process.pid}`);
    httpServer.listen(SERVER_PORT, () => {
      console.log(`App server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    console.log("startHttpServer() method error:", error);
  }
};

const startServer = async () => {
  try {
    const httpServer: http.Server = new http.Server(app);
    // socket
    const socketIO: Server = new SocketServer(httpServer, {
      path: "/api/v1/socket.io",
    });
    departmentSocketListener(socketIO);

    await startHttpServer(httpServer);
  } catch (error) {
    console.log("startServer() error method:", error);
  }
};

startServer();
