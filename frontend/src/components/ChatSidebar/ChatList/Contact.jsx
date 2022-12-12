import { Box, useTheme } from "@mui/material";
import React, { useContext } from "react";
import { useDispatch } from "react-redux";
import { changeActiveConversation } from "../../../redux/reducers/conversationReducer";
import { DarkModeContext } from "../../../shared/context/DarkModeContext";
import { Avatar } from "../../shared/Avatar";
import { Text } from "../../shared/Text";

export default function Contact(props) {
  const { active, contact } = props;
  const theme = useTheme();
  const darkMode = useContext(DarkModeContext);
  const dispatch = useDispatch();

  const createMarkup = (html) => {
    return { __html: html };
  };

  const clickHandler = () => {
    dispatch(
      changeActiveConversation({
        conversationId: null,
        conversationUser: contact,
      })
    );
  };

  return (
    <Box
      onClick={clickHandler}
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
      <Avatar online src={contact?.image} />

      <Box sx={{ overflow: "hidden" }}>
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
            dangerouslySetInnerHTML={createMarkup(contact.searchedName)}
          ></Text>
        </Box>
        <Text variant="regular" color={theme.palette.text.secondary} noWrap>
          Hey there I am using whatsapp
        </Text>
      </Box>
    </Box>
  );
}
