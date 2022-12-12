import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatMain from "../components/ChatMain";
import { ChatSidebar } from "../components/ChatSidebar";
import { io } from "socket.io-client";
import { updateMessages } from "../redux/reducers/messageReducer";
import { updateConversations, updateOnlineConversations } from "../redux/reducers/conversationReducer";
import { useAxios } from "../shared/hooks/useAxios";

const socket = io.connect("ws://localhost:8900");

export default function Home() {
  const { user } = useSelector((state) => state.userReducer);
  const { conversations, activeConversation } = useSelector((state) => state.conversationReducer);
  const { messages } = useSelector((state) => state.messageReducer);
  const { sendRequest } = useAxios();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user?.userId) return;
    socket.emit("addUser", user.userId);
    socket.on("getUsers", (users) => {
      const onlineUsers = users.map((item) => [item.userId, 1]);
      dispatch(updateOnlineConversations(Object.fromEntries(onlineUsers)));
    });
    socket.on("userDisconnected", async (userId) => {
      try {
        await sendRequest(`/users/${userId}`, "PATCH", { lastSeen: new Date().toString() });
      } catch (err) {}
    });
  }, [user?.userId, dispatch]);

  useEffect(() => {
    socket.off("getMessage");
    socket.on("getMessage", (payload) => {
      // In case of message from new conversation
      if (payload.senderDetails) {
        const newConversations = [
          {
            conversationId: payload.message.conversationId,
            conversationUser: payload.senderDetails,
            lastMessage: payload.message,
            unreadMessages: 1,
          },
          ...conversations,
        ];
        dispatch(updateConversations(newConversations));
      } else {
        let receivedMessageConversation = conversations.find((item) => item.conversationId === payload.message.conversationId);
        const temp = { ...receivedMessageConversation, unreadMessages: receivedMessageConversation.unreadMessages + 1, lastMessage: payload.message };
        const filteredConversations = conversations.filter((item) => item.conversationId !== payload.message.conversationId);
        filteredConversations.unshift(temp);
        if (activeConversation?.conversationId === payload.message.conversationId) {
          dispatch(updateMessages([...messages, payload.message]));
        }

        dispatch(updateConversations(filteredConversations));
      }
    });
  }, [activeConversation, messages, dispatch, conversations]);

  if (!user) return null;

  return (
    <div className="wrapper">
      <ChatSidebar />

      <ChatMain socket={socket} />

      {/* <ContactInfo /> */}
    </div>
  );
}
