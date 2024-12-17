import { Server, Socket } from "socket.io";
import SocketServer from "./init";
import { CreateTaskReq } from "@/schemas/task";
import { createDisplayService } from "@/services/display";

export const departmentListener = (io: Server) => {
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

export const createDisplaySender = (
  departmentId: string,
  data: Awaited<ReturnType<typeof createDisplayService>>
) => {
  const factoryNamespace = SocketServer.getInstance().of("/department");

  factoryNamespace.to(departmentId).emit("createDisplay", data);
};

// export const emptyTask = (planId: string) => {
//   const factoryNamespace = SocketServer.getInstance().of("/department");
//   factoryNamespace.to(planId).emit("emptyTask", []);
// };
