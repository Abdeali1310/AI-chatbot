import { verifyToken } from "../utils/token-manager";

const express = require("express");
const userRouter = express.Router();
const {
  getAllUsers,
  userSignup,
  userSignin,
  verifyUser,
  userLogout
} = require("../controllers/userController");

userRouter.get("/", getAllUsers);
userRouter.post("/signup", userSignup);
userRouter.post("/login", userSignin);
userRouter.get("/auth-status", verifyToken, verifyUser);
userRouter.get("/logout", verifyToken, userLogout);

module.exports = userRouter;
