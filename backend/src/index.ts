import cookieParser from "cookie-parser";

const express = require("express");
const { connect } = require("./db/connection");
const appRouter  = require("./routes/index")

const app = express();
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET))

//routes
app.use("/api/v1",appRouter)

app.listen(process.env.PORT, () => {
  console.log("Server started on port ", process.env.PORT);
  //connection
  connect();
});
