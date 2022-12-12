import { Box, useTheme } from "@mui/material";
import React, { Fragment, useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateMessages } from "../../redux/reducers/messageReducer";
import { DarkModeContext } from "../../shared/context/DarkModeContext";
import { useAxios } from "../../shared/hooks/useAxios";
import { Text } from "../shared/Text";

const Message = (props) => {
  const { children, sentMessage, time } = props;
  const theme = useTheme();
  const { darkMode } = useContext(DarkModeContext);
  const messageBackground = sentMessage ? theme.palette.primary.main : theme.palette.secondary.main;
  const messageColor = darkMode || sentMessage ? "white" : "black";

  const messageTime = new Date(time).toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true });

  return (
    <Box sx={{ alignSelf: sentMessage ? "flex-end" : "flex-start", mt: 2, maxWidth: "350px" }}>
      <Text
        variant="regular"
        color={messageColor}
        style={{ backgroundColor: messageBackground, fontWeight: 500, px: 2, py: 1.5, borderRadius: "10px" }}
      >
        {children}
      </Text>
      <Text variant="small" color="gray" style={{ fontWeight: 500, mt: "3px", ml: "2px", textAlign: sentMessage ? "end" : "start" }}>
        {messageTime}
      </Text>
    </Box>
  );
};

function getDifferenceInDays(date1, date2) {
  const diffInMs = Math.abs(date2 - date1);
  return diffInMs / (1000 * 60 * 60 * 24);
}

function getDayName(date) {
  return date.toLocaleDateString("en-US", { weekday: "long" });
}

const getDateTime = (dateStr) => {
  if (!dateStr) return;

  const dayOrder = { Sunday: 0, Monday: 1, Tuesday: 2, Thursday: 3, Friday: 4, Saturday: 5 };

  const messageDate = new Date(dateStr);
  const today = new Date();

  const messageDayName = getDayName(messageDate);
  const todayDayName = getDayName(today);

  const todayOrder = dayOrder[todayDayName];
  const messageDayOrder = dayOrder[messageDayName];

  if (todayOrder - messageDayOrder === 0) return "Today";

  if (todayOrder - messageDayOrder === 1) return "Yesterday";

  if (getDifferenceInDays(messageDate, today) < 6) return messageDayName;

  return messageDate.toLocaleDateString("en-US");

  // const daysDifference = parseInt(getDifferenceInDays(messageDate, today));

  // if (daysDifference === 0) return "Today";

  // if (daysDifference === 1) return "Yesterday";

  // if (daysDifference < 7) return messageDate.toLocaleDateString("en-US", { weekday: "long" });
  // else return messageDate.toLocaleDateString("en-US");
};

export default function Messages(props) {
  const { conversationUser, conversationId } = props;
  const { sendRequest, isLoading, error, clearError } = useAxios();
  const { messages } = useSelector((state) => state.messageReducer);
  const { user } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const theme = useTheme();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView();
  };

  useEffect(() => {
    dispatch(updateMessages([]));
    const getMessages = async () => {
      if (conversationId) {
        try {
          const response = await sendRequest(`/messages/${conversationId}`, "GET");
          let arrTimes = [];
          const temp = response.map((item) => {
            const dateTime = getDateTime(item.createdAt);
            if (!arrTimes.includes(dateTime)) {
              arrTimes.push(dateTime);
              return { ...item, newDay: dateTime };
            }
            return item;
          });

          // console.log(temp);

          dispatch(updateMessages(temp));
        } catch (err) {}
      }
      if (!conversationId) {
        dispatch(updateMessages([]));
      }
    };

    getMessages();
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", px: "20px", overflowY: "auto", backgroundColor: theme.bg.secondary }}>
      {/* <Box style={{ mt: 2 }}></Box> */}

      {messages.map((message) => {
        return (
          <Fragment key={message._id}>
            {message.newDay && (
              <Text
                key={message.newDay}
                variant="bold"
                color="white"
                style={{
                  mt: 2,
                  backgroundColor: "#3B444B",
                  textAlign: "center",
                  textTransform: "uppercase",
                  borderRadius: 10,
                  px: 5,
                  py: 0.6,
                  mx: "auto",
                }}
              >
                {message.newDay}
              </Text>
            )}

            <Message key={message._id} sentMessage={message.sender === user.userId} time={message.createdAt}>
              {message.text}
            </Message>
          </Fragment>
        );
      })}
      <div ref={messagesEndRef} />
    </Box>
  );
}
