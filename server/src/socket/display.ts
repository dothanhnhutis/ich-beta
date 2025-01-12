import { Server } from "socket.io";
import SocketServer from "./init";
import { Display } from "@/schemas/display";
import { Alarm } from "@/schemas/clock";

export const departmentSocketListener = (io: Server) => {
  const departmentNamespace = io.of("/department");
  departmentNamespace.on("connection", (socket) => {
    console.log("A client connected:", socket.id);

    socket.on("joinDepartment", (departmentId) => {
      console.log(`${socket.id} is joining room: ${departmentId}`);
      socket.join(departmentId);
      // socket
      //   .to(departmentId)
      //   .emit("message", `${socket.id} has joined the room.`);
    });

    socket.on("leaveDepartment", (departmentId) => {
      console.log(`${socket.id} is leave room: ${departmentId}`);
      socket.leave(departmentId);
      // socket
      //   .to(departmentId)
      //   .emit("message", `${socket.id} has leave the room.`);
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

export const createDisplaySocketSender = (
  departmentIds: string[],
  data: Display
) => {
  const factoryNamespace = SocketServer.getInstance().of("/department");
  for (const id of departmentIds) {
    factoryNamespace.to(id).emit("createDisplay", data);
  }
};

export const updateDisplaySocketSender = (
  departmentIds: string[],
  data: Display
) => {
  const factoryNamespace = SocketServer.getInstance().of("/department");
  for (const id of departmentIds) {
    factoryNamespace.to(id).emit("updateDisplay", data);
  }
};

export const deleteDisplaySocketSender = (
  departmentIds: string[],
  display: Display
) => {
  const factoryNamespace = SocketServer.getInstance().of("/department");
  for (const id of departmentIds) {
    factoryNamespace.to(id).emit("deleteDisplay", display);
  }
};
