import { Server, Socket } from "socket.io";

export const postRooms = (io: Server, socket: Socket) => {
  socket.on("join:post", (postId: string) => {
    // console.log("joining post room", postId);
    socket.join(`post:${postId}`);
  });

  socket.on("leave:post", (postId: string) => {
    // console.log("leaving post room", postId);
    socket.leave(`post:${postId}`);
  });
};
