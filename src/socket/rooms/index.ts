import { Server, Socket } from "socket.io";
import { inboxRooms } from "./inbox";
import { notificationRooms } from "./notification";
import { postRooms } from "./posts";

export const registerRoomHandlers = (io: Server, socket: Socket) => {
  inboxRooms(io, socket);
  notificationRooms(io, socket);
  postRooms(io, socket);
};
