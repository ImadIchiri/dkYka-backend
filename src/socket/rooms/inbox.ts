import { Server, Socket } from "socket.io";

export const inboxRooms = (io: Server, socket: Socket) => {
  socket.on("join:conversation", (conversationId: string) => {
    socket.join(`conversation:${conversationId}`);
    // console.log(`joined room conversation:${conversationId}`,
    //   Array.from(socket.rooms)
    // );
  });

  socket.on("leave:conversation", (conversationId: string) => {
    socket.leave(`conversation:${conversationId}`);
    // console.log(`leaved room conversation:${conversationId}`,
    //   Array.from(socket.rooms)
    // );
  });
};
