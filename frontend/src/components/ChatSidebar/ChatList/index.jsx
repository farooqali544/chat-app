import { Box, Button, Divider } from "@mui/material";
import React, { useEffect } from "react";
import { memo } from "react";
import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateConversations } from "../../../redux/reducers/conversationReducer";
import { DarkModeContext } from "../../../shared/context/DarkModeContext";
import { useAxios } from "../../../shared/hooks/useAxios";
import Alert from "../../shared/Alert";
import Conversation from "./Conversation";

function ChatList() {
  const { darkMode } = useContext(DarkModeContext);
  const { sendRequest, error, clearError, isLoading } = useAxios();
  const { user } = useSelector((state) => state.userReducer);
  const { conversations, activeConversation } = useSelector((state) => state.conversationReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const conversationList = await sendRequest(`/conversations/${user.userId}`, "GET");
        dispatch(updateConversations(conversationList));
      } catch (err) {}
    })();
  }, [dispatch, user]);

  return (
    <>
      <Alert message={error} onClear={clearError} />
      <Box sx={{ mt: 3.5, flex: 1, height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: "flex", ml: "20px", alignItems: "center", gap: 1 }}>
          {/* Selected */}
          <Button variant="text" color="button" sx={{ color: darkMode ? "#6D6D6D" : "black", fontWeight: 700 }}>
            ALL CHATs
          </Button>
          {/* UnSelected */}
          <Button variant="text" color="button" sx={{ color: darkMode ? "white" : "#BEBEBE", fontWeight: 700 }}>
            PRIVATE
          </Button>
        </Box>

        <Divider sx={{ mt: 1 }} />

        <Box sx={{ overflowY: "auto", flex: 1 }}>
          {isLoading && <div>Loading</div>}
          {conversations.map((convo) => {
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
          })}
        </Box>
      </Box>
    </>
  );
}

export default memo(ChatList);
