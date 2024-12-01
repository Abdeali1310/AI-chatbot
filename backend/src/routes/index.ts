const express = require("express");
const appRouter =  express.Router();
const userRouter = require("./userRoutes.js")
const chatRouter = require("./chatRoutes.js")

appRouter.use("/users",userRouter)
appRouter.use("/chats",chatRouter)

module.exports = appRouter