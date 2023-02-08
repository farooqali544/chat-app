import { Box, useTheme } from "@mui/material";
import React, { useContext, useMemo } from "react";
import { useDispatch } from "react-redux";
import { readMessages } from "../../../redux/slices/messages";
import {
  markMessagesAsRead,
  updateActivePrivateConversation,
} from "../../../redux/slices/privateConversations";
import { DarkModeContext } from "../../../shared/context/DarkModeContext";
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

  if (daysDifference === 0)
    return messageDate.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

  if (daysDifference === 1) return "Yesterday";

  if (daysDifference < 7) return messageDate.toLocaleDateString("en-US", { weekday: "long" });
  else return messageDate.toLocaleDateString("en-US");
};

export default function Conversation(props) {
  const { active, conversation } = props;
  const theme = useTheme();
  const { darkMode } = useContext(DarkModeContext);
  const dispatch = useDispatch();

  const onChangeActiveConversation = () => {
    dispatch(updateActivePrivateConversation(conversation));

    conversation.unreadMessagesCount > 0 && dispatch(readMessages(conversation.lastMessage));
  };

  const name = conversation.members[0].name;
  const image = conversation.members[0].image;
  const lastMessage = conversation.lastMessage;
  const unreadMessagesCount = conversation.unreadMessagesCount;

  return (
    <Box
      onClick={onChangeActiveConversation}
      sx={{
        height: "80px",
        mt: "5px",
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
      <Avatar
        // online={onlineConversations[conversationUser.userId] || false}
        src={image}
      />

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
          >
            {name}
          </Text>
          <Box style={{ flexShrink: 0, display: "flex", alignItems: "center", ml: "auto" }}>
            {!!unreadMessagesCount && (
              <Text
                variant="small"
                color="white"
                style={{
                  backgroundColor: theme.palette.primary.main,
                  px: 0.5,
                  mr: 1,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: "20%",
                  flexShrink: 0,
                }}
              >
                {unreadMessagesCount}
              </Text>
            )}
            <Text variant="small" color={theme.text.tertiary} style={{ fontWeight: "bold" }}>
              {getDateTime(lastMessage?.createdAt)}
            </Text>
          </Box>
        </Box>
        <Text
          variant={!!unreadMessagesCount ? "bold" : "regular"}
          color={theme.palette.text.secondary}
          noWrap
        >
          {lastMessage?.text}
        </Text>
      </Box>
    </Box>
  );
}
