const io = require("socket.io")(8900, {
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
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  socket.on("sendMessage", (payload) => {
    const { receiver } = payload;
    const receiverSocketId = getUser(receiver)?.socketId;

    receiverSocketId && io.to(receiverSocketId).emit("getMessage", payload);
  });

  socket.on("disconnect", () => {
    const userId = users.find((user) => user.socketId === socket.id)?.userId;
    userId && io.emit("userDisconnected", userId);
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
