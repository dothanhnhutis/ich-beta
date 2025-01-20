import http from "http";
import env from "@/shared/configs/env";
import { connectCache } from "@/shared/cache/connect";
import { buildServer } from "@/shared/utils/server";

const SERVER_PORT = 4000;

const startHttpServer = (httpServer: http.Server) => {
  try {
    console.log(`Server has started with process id ${process.pid}`);
    httpServer.listen(SERVER_PORT, () => {
      console.log(`Server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    console.log("startHttpServer() method error:", error);
  }
};

const startServer = async () => {
  try {
    const server = buildServer();
    const httpServer: http.Server = new http.Server(server);
    // redis cache
    connectCache();
    // queue BullMQ
    // initWorker();
    // rabbitMQ
    // const amqp = new Amqp(env.RABBITMQ_URL);
    // await amqp.connect();
    //   await sendEmailListener();

    //   for (const s of ["SIGINT", "SIGTERM"]) {
    //     process.once(s, async () => {
    //       await Amqp.conn.close();
    //     });
    //   }

    // socketIO
    // const socketIO: Server = new SocketServer(httpServer, {
    //   path: "/api/v1/socket.io",
    // });

    // departmentSocketListener(socketIO);
    startHttpServer(httpServer);
  } catch (error) {
    console.log("startServer() error method:", error);
  }
};

startServer();
