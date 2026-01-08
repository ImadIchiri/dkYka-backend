import { Server, Socket } from "socket.io";

export const inboxHandler = (io: Server, socket: Socket) => {
  socket.on("inbox:typing", (data: { conversationId: string; userId: string }) => {
    // console.log("typing", data);
    socket
      .to(`conversation:${data.conversationId}`)
      .emit("inbox:typing", data);
  });
};
