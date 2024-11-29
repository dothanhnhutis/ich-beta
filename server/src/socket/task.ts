import { Server, Socket } from "socket.io";
import SocketServer from "./init";
import { CreateTaskReq } from "@/schemas/task";

export const taskListener = (io: Server) => {
  const factoryNamespace = io.of("/task");
  factoryNamespace.on("connection", (socket) => {
    console.log("A client connected:", socket.id);

    socket.on("joinPlanRoom", (roomName) => {
      console.log(`${socket.id} is joining room: ${roomName}`);
      socket.join(roomName);
      socket.to(roomName).emit("message", `${socket.id} has joined the room.`);
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

export const taskSend = (data: CreateTaskReq["body"]) => {
  const factoryNamespace = SocketServer.getInstance().of("/task");

  factoryNamespace.to(data.planId).emit("createTask", data);
};

export const emptyTask = (planId: string) => {
  const factoryNamespace = SocketServer.getInstance().of("/task");
  factoryNamespace.to(planId).emit("emptyTask", []);
};
