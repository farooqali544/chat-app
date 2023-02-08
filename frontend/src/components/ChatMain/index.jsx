import { Box } from "@mui/system";
import React, { useContext, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMessages } from "../../redux/slices/messages";
import { DarkModeContext } from "../../shared/context/DarkModeContext";
import { SocketContext } from "../../shared/context/SocketContext";
import ChatMainHeader from "./ChatMainHeader";
import Messages from "./Messages";
import SendMessage from "./SendMessage";

export default function ChatMain(props) {
  const { darkMode } = useContext(DarkModeContext);
  const privateConversations = useSelector((state) => state.privateConversations);
  const activeConversation = privateConversations.activeConversation;

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        borderRight: !darkMode && "1px solid #F2F2F2",
      }}
    >
      {activeConversation && (
        <>
          <ChatMainHeader activeConversation={activeConversation} />

          <Messages activeConversation={activeConversation} />

          <SendMessage activeConversation={activeConversation} />
        </>
      )}
    </Box>
  );
}
