import { Request, Response } from "express";
import * as chatService from "../../services/chatboot";
import type { ChatRequest } from "../../types/chatboot";

export const chatBotController = async (
  req: Request<{}, {}, ChatRequest>,
  res: Response
) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const reply = await chatService.askChatBot(message);

    res.json({ reply });
  } catch (error: any) {
    console.error("ChatBot error:", error);
    res.status(500).json({ message: "ChatBot failed" });
  }
};
