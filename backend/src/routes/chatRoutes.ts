import { verifyToken } from "../utils/token-manager";
const { generateChatCompletion } = require("../controllers/chatController");
const express = require("express");
const chatRouter = express.Router();

chatRouter.post("/new", verifyToken, generateChatCompletion);

module.exports = chatRouter;
