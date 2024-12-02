const express = require("express");
const appRouter =  express.Router();
const userRouter = require("./userRoutes.js")
const chatRouter = require("./chatRoutes.js")

appRouter.use("/user",userRouter)
appRouter.use("/chat",chatRouter)

module.exports = appRouter