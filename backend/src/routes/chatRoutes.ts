import { verifyToken } from "../utils/token-manager";
const { generateChatCompletion,getAllChats } = require("../controllers/chatController");
const express = require("express");
const chatRouter = express.Router();

chatRouter.post("/new", verifyToken, generateChatCompletion);
chatRouter.get("/all-chats", verifyToken, getAllChats);


module.exports = chatRouter;
