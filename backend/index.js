require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

const usersRoute = require("./routes/users");
const conversationRoute = require("./routes/conversations");
const messagesRoute = require("./routes/messages");
const chatRoute  = require("./routes/chat");


app.use("/users", usersRoute);
app.use("/conversations", conversationRoute);
app.use("/messages", messagesRoute);
app.use("/chat", chatRoute);


app.use((error, req, res, next) => {
  //errors : validation errors
  const { message, status, errors } = error;
  res.status(status || 500);
  res.json({ message: message || "An unkown error occured",status, errors });
});

try {
  mongoose.connect("mongodb://127.0.0.1:27017/chat-app").then(() => {
    console.log("connected");
    app.listen(5000);
  });
} catch (e) {
  console.log("could not connect");
}
