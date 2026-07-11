import Message from "../models/Message.js";

export const roomId = (a, b) => [a.toString(), b.toString()].sort().join("_");

// GET /api/messages/:otherUserId
export const getConversation = async (req, res) => {
  const room = roomId(req.user._id, req.params.otherUserId);
  const messages = await Message.find({ room }).sort("createdAt");
  res.json(messages);
};
