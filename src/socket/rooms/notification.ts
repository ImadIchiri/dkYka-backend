import { Server, Socket } from "socket.io";

export const notificationRooms = (io: Server, socket: Socket) => {
  socket.on("join:notifications", (userId: string) => {
    socket.join(`user:${userId}`);
    // console.log( `joined room user:${userId}`,
    //   Array.from(socket.rooms));
  });

  socket.on("leave:notifications", (userId: string) => {
    socket.leave(`user:${userId}`);
    // console.log( `leaved room user:${userId}`,
    //   Array.from(socket.rooms));
  });
};
