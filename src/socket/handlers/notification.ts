import { Server, Socket } from "socket.io";

export const notificationHandler = (io: Server, socket: Socket) => {
  socket.on("notification:read", (notificationId: string) => {
    // logique DB plus tard
    socket.emit("notification:read:success", notificationId);
  });
};
