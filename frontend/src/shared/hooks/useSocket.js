import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { insertMessage, readMessages } from "../../redux/slices/messages";
import {
  addLastMessageToPrivateConversation,
  markMessagesAsRead,
  sortPrivateConversations,
} from "../../redux/slices/privateConversations";

const socket = io("http://localhost:8000");

export default function useSocket() {
  const auth = useSelector((state) => state.auth);
  const privateConversations = useSelector((state) => state.privateConversations);
  const dispatch = useDispatch();

  // Add user on initial load
  useEffect(() => {
    socket.emit("addUser", auth.user._id);
  }, []);

  useEffect(() => {
    const receiveMessageHandler = (payload) => {
      if (privateConversations.activeConversation?._id === payload.conversationId) {
        dispatch(insertMessage(payload));
        dispatch(readMessages(payload));
      } else {
        dispatch(addLastMessageToPrivateConversation(payload));
        dispatch(insertMessage(payload));
      }
      dispatch(sortPrivateConversations());
    };

    socket.on("receiveMessage", receiveMessageHandler);

    return () => {
      socket.off("receiveMessage", receiveMessageHandler);
    };
  }, [privateConversations.activeConversation]);

  const socket_sendMessage = (payload) => {
    socket.emit("sendMessage", payload);
    const { receiverId, ...message } = payload;
    dispatch(markMessagesAsRead(message));
    dispatch(sortPrivateConversations());
  };

  return { socket_sendMessage };
}
