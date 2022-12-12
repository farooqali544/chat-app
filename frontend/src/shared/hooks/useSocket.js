import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateMessages } from "../../redux/reducers/messageReducer";
import { io } from "socket.io-client";

const socket = io.connect("ws://localhost:8900");

export default function useSocket(userId) {
  const { activeConversation } = useSelector((state) => state.conversationReducer);
  const { messages } = useSelector((state) => state.messageReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userId || !socket) return;

    socket.emit("addUser", userId);
    socket.on("getUsers", (users) => {
      console.log(users);
    });
  }, [userId, socket]);


    socket.on("getMessage", (payload) => {
      console.log(messages);
      if (activeConversation.conversationId === payload.conversationId) {
        console.log(payload);
        dispatch(updateMessages([...messages, payload]));
      }
    });


  const emitMessage = (payload) => {
    socket.emit("sendMessage", payload);
  };

  return { emitMessage };
}
