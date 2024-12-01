const express = require("express");
const chatRouter =  express.Router();

chatRouter.get("/",(req,res)=>{
    res.send("Hello World")
})

module.exports = chatRouter