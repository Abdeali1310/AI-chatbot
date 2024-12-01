const mongoose = require("mongoose");

async function connect() {
  await mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
      console.log("MongoDB Connected");
    })
    .catch((error) => {
      console.log("Error while connecting to MongoDB ", error);
    });
}

module.exports = { connect };
