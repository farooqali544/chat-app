import { Box, Divider, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchChatAPI } from "../../redux/slices/searchChat";
import { Text } from "../shared/Text";

export default function SearchList({ searchValue }) {
  const searchChat = useSelector((state) => state.searchChat);
  const dispatch = useDispatch();
  const theme = useTheme();

  useEffect(() => {
    dispatch(searchChatAPI(searchValue));
  }, [searchValue]);

  return (
    <Box sx={{ overflowY: "auto" }}>
      <Text variant="main" color={theme.palette.primary.main} style={{ mx: "20px", my: "20px" }}>
        CONVERSATIONS
      </Text>
      <Divider sx={{ width: "80%", mx: "auto" }} />
      {searchChat.data.messages.map((item) => (
        <Text color="white">{item.text}</Text>
      ))}

      <Text variant="main" color={theme.palette.primary.main} style={{ mx: "20px", my: "20px" }}>
        GROUPS
      </Text>
      <Divider sx={{ width: "80%", mx: "auto" }} />
      {searchChat.data.messages.map((item) => (
        <Text color="white">{item.text}</Text>
      ))}

    

      <Text variant="main" color={theme.palette.primary.main} style={{ mx: "20px", my: "20px" }}>
        CONTACTS
      </Text>
      <Divider sx={{ width: "80%", mx: "auto" }} />
      {searchChat.data.contacts.map((item) => (
        <Text color="white">{item.name}</Text>
      ))}

      <Text variant="main" color={theme.palette.primary.main} style={{ mx: "20px", my: "20px" }}>
        CONTACTS
      </Text>
      <Divider sx={{ width: "80%", mx: "auto" }} />
      {searchChat.data.contacts.map((item) => (
        <Text color="white">{item.name}</Text>
      ))}

      <Text variant="main" color={theme.palette.primary.main} style={{ mx: "20px", my: "20px" }}>
        CHATS
      </Text>
      <Divider sx={{ width: "80%", mx: "auto" }} />
      {searchChat.data.contacts.map((item) => (
        <Text color="white">{item.name}</Text>
      ))}
      {/* {filteredContacts.map((convo) => {
        const { _id: userId, name, searchedName, email, image } = convo;
        return <Contact contact={{ userId, name, searchedName, email, image }} key={userId} />;
      })} */}
    </Box>
  );
}
