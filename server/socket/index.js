import { Server } from "socket.io";
import Message from "../models/Message.js";
import { roomId } from "../controllers/messageController.js";
import { encrypt } from "../utils/ChatCrypto.js";


export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: { origin: process.env.CLIENT_URL, methods: ["GET", "POST"] },
  });

  io.on("connection", (socket) => {
    // join a private room between two user ids
    socket.on("join", ({ me, other }) => {
      socket.join(roomId(me, other));
    });

    // send + persist a message
    socket.on("message", async ({ sender, receiver, text }) => {
      const room = roomId(sender, receiver);
      const msg = await Message.create({ room, sender, receiver, text:encrypt(text) });
      io.to(room).emit("message", {...msg.toObject(),text});
    });

    socket.on("typing", ({ me, other }) => {
      socket.to(roomId(me, other)).emit("typing", { from: me });
    });
  });

  return io;
};
