import { Box, useTheme } from "@mui/material";
import React, { Fragment, useEffect } from "react";
import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMessages, loadMoreMessages } from "../../redux/slices/messages";
import { DarkModeContext } from "../../shared/context/DarkModeContext";
import { formatDate } from "../../utils/date";
import { Text } from "../shared/Text";
import InfiniteScroll from "react-infinite-scroll-component";

const Message = (props) => {
  const { children, sentMessage, time } = props;
  const theme = useTheme();
  const { darkMode } = useContext(DarkModeContext);
  const messageBackground = sentMessage ? theme.palette.primary.main : theme.palette.secondary.main;
  const messageColor = darkMode || sentMessage ? "white" : "black";

  const messageTime = new Date(time).toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return (
    <Box sx={{ alignSelf: sentMessage ? "flex-end" : "flex-start", mt: 2, maxWidth: "350px" }}>
      <Text
        variant="regular"
        color={messageColor}
        style={{
          wordBreak: "break-all",
          backgroundColor: messageBackground,
          fontWeight: 500,
          px: 2,
          py: 1.5,
          borderRadius: "10px",
        }}
      >
        {children}
      </Text>
      <Text
        variant="small"
        color="gray"
        style={{ fontWeight: 500, mt: "3px", ml: "2px", textAlign: sentMessage ? "end" : "start" }}
      >
        {messageTime}
      </Text>
    </Box>
  );
};

export default function Messages(props) {
  const { activeConversation } = props;

  const messages = useSelector((state) => state.messages);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!messages.data[activeConversation._id]) {
      dispatch(getMessages(activeConversation._id));
    }
  }, [activeConversation]);

  let prevMessageDates = [];

  const loadMoreMessagesApi = () => {
    dispatch(
      loadMoreMessages({
        conversationId: activeConversation._id,
        firstMessageTime: messages.data[activeConversation._id][0].createdAt,
      })
    );
  };

  const theme = useTheme();

  return (
    <Box
      id="scrollableDiv"
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column-reverse",
        px: "20px",
        overflowY: "auto",
        backgroundColor: theme.bg.secondary,
      }}
    >
      <InfiniteScroll
        dataLength={messages.data[activeConversation._id]?.length || 30}
        next={loadMoreMessagesApi}
        style={{ display: "flex", flexDirection: "column" }} //To put endMessage and loader to the top.
        inverse={true} //
        hasMore={!messages.allMessagesFetched[activeConversation._id]}
        loader={<h4>Loading...</h4>}
        scrollableTarget="scrollableDiv"
      >
        {messages.data[activeConversation._id]?.map((message) => {
          const currentMessageDate = formatDate(message.createdAt); //i.e, today, yesterday
          let newDay;
          if (prevMessageDates === null || !prevMessageDates.includes(currentMessageDate)) {
            newDay = currentMessageDate;
          }
          prevMessageDates.push(currentMessageDate);

          return (
            <Fragment key={message._id}>
              {newDay ? (
                <Text
                  // key={message.newDay}
                  variant="bold"
                  color="white"
                  style={{
                    mt: 2,
                    position: "sticky",
                    top: 10,
                    backgroundColor: "#3B444B",
                    textAlign: "center",
                    textTransform: "uppercase",
                    borderRadius: 10,
                    px: 5,
                    py: 0.6,
                    mx: "auto",
                  }}
                >
                  {newDay}
                </Text>
              ) : null}

              <Message sentMessage={message.sender === auth.user._id} time={message.createdAt}>
                {message.text}
              </Message>
            </Fragment>
          );
        })}
      </InfiniteScroll>
      {messages.allMessagesFetched[activeConversation._id] && (
        <Text color="white" style={{ mx: "auto", mt: "10px" }}>
          {"Your Messages are end-to-end encrypted"}
        </Text>
      )}
    </Box>
  );
}
