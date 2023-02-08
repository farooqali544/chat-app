import { Box, Button, Divider } from "@mui/material";
import React, { useEffect } from "react";
import { memo } from "react";
import { useContext } from "react";
import { DarkModeContext } from "../../../shared/context/DarkModeContext";
import Conversation from "./Conversation";
import { useDispatch, useSelector } from "react-redux";
import {
  getPrivateConversations,
  updateActivePrivateConversation,
} from "../../../redux/slices/privateConversations";

const TabButton = ({ children, active }) => {
  const { darkMode } = useContext(DarkModeContext);

  const sx = active
    ? { color: darkMode ? "white" : "black" }
    : { color: darkMode ? "#6D6D6D" : "#BEBEBE" };

  return (
    <Button variant="text" color="button" sx={{ fontWeight: 700, ...sx }}>
      {children}
    </Button>
  );
};

function ChatList() {
  const { darkMode } = useContext(DarkModeContext);
  const privateConversations = useSelector((state) => state.privateConversations);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPrivateConversations());
  }, []);

  return (
    <>
      {/* <Alert message={error} onClear={clearError} /> */}
      <Box
        sx={{
          mt: 3.5,
          flex: 1,
          height: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ display: "flex", ml: "20px", alignItems: "center", gap: 1 }}>
          <TabButton active>CHATS</TabButton>
          <TabButton>GROUPS</TabButton>
        </Box>

        <Divider sx={{ mt: 1 }} />

        <Box sx={{ overflowY: "auto", flex: 1 }}>
          {privateConversations.data.map((conversation) => (
            <Conversation
              key={conversation._id}
              conversation={conversation}
              active={conversation._id === privateConversations.activeConversation?._id}
            />
          ))}
          {/* {isLoading && <div>Loading</div>} */}
          {/* {conversations.map((convo) => {
            const { conversationUser, conversationId, lastMessage, unreadMessages } = convo;
            const fullName = conversationUser.firstName + " " + conversationUser.lastName;
            return (
              <Conversation
                unreadMessagesCount={unreadMessages}
                lastMessage={lastMessage}
                conversationUser={{ userId: conversationUser._id, fullName, ...conversationUser }}
                conversationId={conversationId}
                key={conversationId}
                active={activeConversation?.conversationId === conversationId}
              />
            );
          })} */}
        </Box>
      </Box>
    </>
  );
}

export default memo(ChatList);
