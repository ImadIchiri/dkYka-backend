import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { registerRoomHandlers } from "./rooms";
import { registerEventHandlers } from "./handlers";

let io: Server;

export const initSocket = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  console.log("Initializing Socket.io");

  io.on("connection", (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    registerRoomHandlers(io, socket);
    registerEventHandlers(io, socket);
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
