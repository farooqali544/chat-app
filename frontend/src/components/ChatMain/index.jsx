import { Box } from "@mui/system";
import React, { useContext, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { DarkModeContext } from "../../shared/context/DarkModeContext";
import ChatMainHeader from "./ChatMainHeader";
import Messages from "./Messages";
import SendMessage from "./SendMessage";

export default function ChatMain(props) {
  const { socket } = props;
  const { darkMode } = useContext(DarkModeContext);
  const { activeConversation } = useSelector((state) => state.conversationReducer);

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", borderRight: !darkMode && "1px solid #F2F2F2" }}>
      {activeConversation && (
        <>
          <ChatMainHeader conversationUser={activeConversation.conversationUser} conversationId={activeConversation.conversationId} />

          <Messages socket={socket} conversationUser={activeConversation.conversationUser} conversationId={activeConversation.conversationId} />

          <SendMessage socket={socket} conversationUser={activeConversation.conversationUser} conversationId={activeConversation.conversationId} />
        </>
      )}
    </Box>
  );
}
