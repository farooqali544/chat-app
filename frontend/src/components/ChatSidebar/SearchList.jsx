import { Box, Divider, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateContacts } from "../../redux/reducers/contactReducer";
import { useAxios } from "../../shared/hooks/useAxios";
import { Text } from "../shared/Text";
import Contact from "./ChatList/Contact";
import Conversation from "./ChatList/Conversation";

export const SearchList = () => {
  const { sendRequest } = useAxios();
  const [filteredContacts, setFilteredContacts] = useState([]);
  const { user } = useSelector((state) => state.userReducer);
  const { contacts, searchValue } = useSelector((state) => state.contactReducer);
  const { conversations,activeConversation } = useSelector((state) => state.conversationReducer);
  const dispatch = useDispatch();

  const theme = useTheme();

  useEffect(() => {
    const getContacts = async () => {
      try {
        const response = await sendRequest(`/contacts/${user.userId}`, "GET");
        dispatch(updateContacts(response));
      } catch (err) {}
    };

    getContacts();
  }, []);

  useEffect(() => {
    const conversationUsersId = conversations.map((item) => item.conversationUser._id);
    const temp = contacts.filter((contact) => !conversationUsersId.includes(contact._id));

    const newContacts = temp
      .filter((contact) => {
        return contact.name.toLowerCase().includes(searchValue.toLowerCase());
      })
      .map((item) => {
        let newName = item.name.replace(new RegExp(searchValue, "gi"), (match) => `<span style=color:${theme.palette.primary.main}>${match}</span>`);

        return {
          ...item,
          searchedName: newName,
        };
      });

    setFilteredContacts(newContacts);
  }, [contacts, searchValue, conversations]);

  const filteredConversations = conversations
    .filter(({ conversationUser }) => {
      return conversationUser.name.toLowerCase().includes(searchValue.toLowerCase());
    })
    .map((conversation) => {
      const { conversationUser } = conversation;
      let newName = conversationUser.name.replace(
        new RegExp(searchValue, "gi"),
        (match) => `<span style=color:${theme.palette.primary.main}>${match}</span>`
      );

      return {
        ...conversation,
        conversationUser: {
          ...conversation.conversationUser,
          searchedName: newName,
        },
      };
    });

  return (
    <Box sx={{ overflowY: "auto" }}>
      <Text variant="main" color={theme.palette.primary.main} style={{ mx: "20px", my: "20px" }}>
        CHATS
      </Text>
      <Divider sx={{ width: "80%", mx: "auto" }} />

      {filteredConversations.map((convo) => {
        const { conversationUser, conversationId, lastMessage, unreadMessages } = convo;
        return (
          <Conversation
            unreadMessagesCount={unreadMessages}
            lastMessage={lastMessage}
            conversationUser={{ userId: conversationUser._id, ...conversationUser }}
            conversationId={conversationId}
            key={conversationId}
            active={activeConversation?.conversationId === conversationId}
          />
        );
      })}

      <Text variant="main" color={theme.palette.primary.main} style={{ mx: "20px", my: "20px" }}>
        CONTACTS
      </Text>
      <Divider sx={{ width: "80%", mx: "auto" }} />
      {filteredContacts.map((convo) => {
        const { _id: userId, name, searchedName, email, image } = convo;
        return <Contact contact={{ userId, name, searchedName, email, image }} key={userId} />;
      })}
    </Box>
  );
};
