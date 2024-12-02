import { NextFunction, Request, Response } from "express";
import { signinSchema, signupSchema } from "../utils/validators";
import z from "zod";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

async function getAllUsers(req: Request, res: Response) {
  try {
    const users = await User.find();
    return res.status(200).json({ users: users });
  } catch (error) {
    console.log("Error while retrieving users " + error);
    res.status(500).json({ msg: "Error while retrieving users" });
  }
}

async function userSignup(req: Request, res: Response) {
  try {
    const { username, password, email } = signupSchema.parse(req.body);

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const user = await User.create({
      username,
      password,
      email,
    });

    //deleting old cookie
    res.clearCookie("auth_token", {
      httpOnly: true,
      domain: "localhost",
      signed: true,
    });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      //creating new cookie
      const expires = new Date();
      expires.setDate(expires.getDate() + 7);

      res.cookie("auth_token", token, {
        path: "/",
        domain: "localhost",
        expires,
        httpOnly: true,
        signed: true,
        secure: true,
      });

      return res
        .status(201)
        .json({
          user: user._id,
          name: user.username,
          email: user.email,
          token: token,
        });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }

    console.error(error);
    return res.status(500).json({ msg: "Email already exists" });
  }
}

async function userSignin(req: Request, res: Response) {
  try {
    const { email, password } = signinSchema.parse(req.body);

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isPasswordValid = await bcrypt.compare(
      password.trim(),
      existingUser.password.trim()
    );

    //deleting old cookie
    res.clearCookie("auth_token", {
      httpOnly: true,
      domain: "localhost",
      signed: true,
    });

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    //creating new cookie
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    res.cookie("auth_token", token, {
      path: "/",
      domain: "localhost",
      expires,
      httpOnly: true,
      signed: true,
      secure: true,
    });

    return res
      .status(200)
      .json({
        id: existingUser._id,
        name: existingUser.username,
        email: existingUser.email,
        token,
      });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }

    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    return res
      .status(200)
      .json({ message: "OK", name: user.name, email: user.email });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};

module.exports = { getAllUsers, userSignup, userSignin, verifyUser };
