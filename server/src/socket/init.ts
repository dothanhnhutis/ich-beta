import env from "@/configs/env";
import { Server, ServerOptions } from "socket.io";
import http from "http";

const opt: Partial<ServerOptions> = {
  cors: {
    origin: `${env.CLIENT_URL}`,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  },
};

class SocketServer extends Server {
  private static io: SocketServer;

  constructor(httpServer: http.Server, options?: Partial<ServerOptions>) {
    super(httpServer, { ...opt, ...options });
    SocketServer.io = this;
  }

  public static getInstance(): SocketServer {
    if (!SocketServer.io) {
      throw Error("httpServer to create SocketServer");
    }
    return SocketServer.io;
  }
}

export default SocketServer;
