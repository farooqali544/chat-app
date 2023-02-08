const io = require("socket.io")(8000, {
  cors: {
    origin: "*",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) && users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("connected", socket.id);
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  socket.on("sendMessage", (payload) => {
    console.log(users);
    const { receiverId, ...message } = payload;
    const receiverSocketId = getUser(receiverId)?.socketId;

    receiverSocketId && io.to(receiverSocketId).emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("disconnected", socket.id);
    const userId = users.find((user) => user.socketId === socket.id)?.userId;
    userId && io.emit("userDisconnected", userId);
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
