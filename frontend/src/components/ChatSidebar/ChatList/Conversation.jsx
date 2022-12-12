import { Box, useTheme } from "@mui/material";
import React, { useContext, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeActiveConversation, updateConversations } from "../../../redux/reducers/conversationReducer";
import { DarkModeContext } from "../../../shared/context/DarkModeContext";
import { useAxios } from "../../../shared/hooks/useAxios";
import { Avatar } from "../../shared/Avatar";
import { Text } from "../../shared/Text";

function getDifferenceInDays(date1, date2) {
  const diffInMs = Math.abs(date2 - date1);
  return diffInMs / (1000 * 60 * 60 * 24);
}

const getDateTime = (dateStr) => {
  const messageDate = new Date(dateStr);
  const today = new Date();

  const daysDifference = parseInt(getDifferenceInDays(messageDate, today));

  if (daysDifference === 0) return messageDate.toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true });

  if (daysDifference === 1) return "Yesterday";

  if (daysDifference < 7) return messageDate.toLocaleDateString("en-US", { weekday: "long" });
  else return messageDate.toLocaleDateString("en-US");
};

export default function Conversation(props) {
  const { active, unreadMessagesCount, lastMessage, conversationUser, conversationId } = props;
  const theme = useTheme();
  const { darkMode } = useContext(DarkModeContext);
  const { sendRequest } = useAxios();
  const { conversations, onlineConversations } = useSelector((state) => state.conversationReducer);
  const dispatch = useDispatch();

  const onChangeActiveConversation = async () => {
    dispatch(changeActiveConversation({ conversationId, conversationUser }));

    if (unreadMessagesCount > 0) {
      const temp = conversations.map((item) => (item.conversationId === conversationId ? { ...item, unreadMessages: 0 } : item));
      dispatch(updateConversations(temp));
    }

    try {
      await sendRequest(`/messages/unread/${conversationId}`, "PATCH");
    } catch (err) {}
  };

  const createMarkup = (html) => {
    return { __html: html };
  };

  const lastMessageTime = useMemo(() => lastMessage && getDateTime(lastMessage.createdAt), [lastMessage]);

  return (
    <Box
      onClick={onChangeActiveConversation}
      sx={{
        height: "80px",
        backgroundColor: active ? theme.bg.secondary : "transparent",
        display: "flex",
        alignItems: "center",
        pl: "20px",
        pr: "10px",
        gap: "10px",
        transition: "all 0.2s ease-out",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: !active && (darkMode ? "rgba(0,0,0,0.3)" : "#F5F6F6"),
        },
      }}
    >
      <Avatar online={onlineConversations[conversationUser.userId] || false} src={conversationUser?.image} />

      <Box sx={{ overflow: "hidden", flex: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            variant="main"
            noWrap
            color={!active && darkMode ? "#B8B8B8" : theme.palette.text.primary}
            dangerouslySetInnerHTML={createMarkup(conversationUser.searchedName || conversationUser.name)}
          />
          <Box style={{ flexShrink: 0, display: "flex", alignItems: "center", ml: "auto" }}>
            {!!unreadMessagesCount && (
              <Text variant="small" color="white" style={{ backgroundColor: theme.palette.primary.main, px: 0.5, mr: 0.5, borderRadius: "15px" }}>
                {unreadMessagesCount}
              </Text>
            )}
            <Text variant="small" color={theme.text.tertiary} style={{ fontWeight: "bold" }}>
              {lastMessageTime}
            </Text>
          </Box>
        </Box>
        <Text
          variant={!!unreadMessagesCount ? "bold" : "regular"}
          color={!!unreadMessagesCount && !darkMode ? "black" : theme.palette.text.secondary}
          noWrap
        >
          {lastMessage?.text}
        </Text>
      </Box>
    </Box>
  );
}
