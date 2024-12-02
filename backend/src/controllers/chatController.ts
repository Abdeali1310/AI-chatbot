import { NextFunction, Request, Response } from "express";
import z from "zod";
import { chatSchema } from "../utils/validators";
import { generate } from "../config/gemini-config";
const User = require("../models/User");

async function generateChatCompletion(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { message } = chatSchema.parse(req.body);
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res
        .status(401)
        .json({ msg: "User not registered or token malfunctioned" });
    }

    const chats = user.chats.map(({ role, content }) => ({ role, content }));
    chats.push({ content: message, role: "user" });

    await user.chats.push({ content: message, role: "user" });

    //integrate with gemini
    const chatResponse = await generate(message);

    await user.chats.push({ content: chatResponse, role: "assistant" });
    await user.save();
    return res.status(200).json({ chats: user.chats });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }

    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
}

const getAllChats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    return res.status(200).json({ message: "OK", chats: user.chats });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};

const deleteAllChats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }

    user.chats = [];
    await user.save();
    return res.status(200).json({ message: "OK" });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};
module.exports = { generateChatCompletion, getAllChats,deleteAllChats };
