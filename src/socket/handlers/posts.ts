import { Server, Socket } from "socket.io";

export const postHandler = (io: Server, socket: Socket) => {
  socket.on("post:typingComment", (postId: string) => {
    // console.log("typing comment on post", postId);
    socket.to(`post:${postId}`).emit("post:typingComment");
  });
};
