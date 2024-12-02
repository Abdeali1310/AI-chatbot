import { verifyToken } from "../utils/token-manager";

const express = require("express");
const userRouter = express.Router();
const {
  getAllUsers,
  userSignup,
  userSignin,
  verifyUser,
} = require("../controllers/userController");

userRouter.get("/", getAllUsers);
userRouter.post("/signup", userSignup);
userRouter.post("/login", userSignin);
userRouter.get("/auth-status", verifyToken, verifyUser);

module.exports = userRouter;
