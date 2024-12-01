const express = require("express");
const userRouter =  express.Router();
const {getAllUsers,userSignup,userSignin} = require("../controllers/userController")

userRouter.get("/",getAllUsers)
userRouter.post("/signup",userSignup)
userRouter.post("/signin",userSignin)

module.exports = userRouter