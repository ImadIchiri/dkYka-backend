import { Server, Socket } from "socket.io";

export const connectionHandler = (io: Server, socket: Socket) => {
  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });

  // socket.on("ping", () => {
  //   console.log(`Received ping from socket: ${socket.id}`);
  //   socket.emit("pong");
  // });
};
