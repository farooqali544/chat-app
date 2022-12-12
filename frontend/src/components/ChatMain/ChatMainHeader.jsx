import { Box, IconButton, useTheme } from "@mui/material";
import React, { memo, useContext } from "react";
import { Avatar } from "../shared/Avatar";
import { Text } from "../shared/Text";
import { ReactComponent as DotsIcon } from "../../assets/svgs/Dots.svg";
import { ReactComponent as VideoCallIcon } from "../../assets/svgs/Video.svg";
import { ReactComponent as CallIcon } from "../../assets/svgs/Call.svg";
import { ManageIcon } from "../shared/ManageIcon";
import { DarkModeContext } from "../../shared/context/DarkModeContext";
import { useSelector } from "react-redux";

function getDifferenceInDays(date1, date2) {
  const diffInMs = Math.abs(date2 - date1);
  return diffInMs / (1000 * 60 * 60 * 24);
}

const getDateTime = (dateStr) => {
  if (!dateStr) return;

  const messageDate = new Date(dateStr);
  const today = new Date();

  const daysDifference = parseInt(getDifferenceInDays(messageDate, today));

  if (daysDifference === 0) return messageDate.toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true });

  if (daysDifference === 1) return "Yesterday";

  if (daysDifference < 7) return messageDate.toLocaleDateString("en-US", { weekday: "long" });
  else return messageDate.toLocaleDateString("en-US");
};

export default memo(function ChatMainHeader(props) {
  const { conversationId, conversationUser } = props;
  const { onlineConversations } = useSelector((state) => state.conversationReducer);
  const theme = useTheme();
  const { darkMode } = useContext(DarkModeContext);

  const getLastSeen = () => {
    if (onlineConversations[conversationUser.userId]) {
      return "Online";
    }
    return "Last Seen " + getDateTime(conversationUser.lastSeen);
  };

  return (
    <Box
      sx={{
        height: "72px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        pl: "20px",
        pr: "10px",
        backgroundColor: theme.bg.primary,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar src={conversationUser.image} />

        <Box>
          <Text variant="main" color={theme.palette.text.primary}>
            {conversationUser.name}
          </Text>
          <Text variant="small" color="#B9BEC3" style={{ fontWeight: 500 }}>
            {getLastSeen()}
          </Text>
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <ManageIcon icon={VideoCallIcon} />
        <ManageIcon icon={CallIcon} />
        <ManageIcon icon={DotsIcon} />
      </Box>
    </Box>
  );
});
