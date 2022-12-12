import { Box, ClickAwayListener, IconButton, InputBase, useTheme } from "@mui/material";
import { ReactComponent as LinkIcon } from "../../assets/svgs/Paperclip.svg";
import { ReactComponent as VoiceIcon } from "../../assets/svgs/Microphone.svg";
import SendIcon from "@mui/icons-material/Send";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAxios } from "../../shared/hooks/useAxios";
import { useDispatch, useSelector } from "react-redux";
import { updateMessages } from "../../redux/reducers/messageReducer";
import { changeActiveConversation, updateConversations } from "../../redux/reducers/conversationReducer";
import { searchHandler } from "../../redux/reducers/contactReducer";
const EmojiPicker = React.lazy(() => import("./EmojiPicker"));

const TextField = (props) => {
  const { conversationId, messageHandler, value, ...inputProps } = props;
  const [isEmojiShown, setIsEmojiShown] = useState(false);
  const theme = useTheme();
  const inputRef = useRef(null);

  const showEmoji = useCallback(() => {
    setIsEmojiShown(true);
  }, []);

  useEffect(() => {
    inputRef?.current?.focus();
  }, [conversationId, inputRef]);

  return (
    <ClickAwayListener onClickAway={() => setIsEmojiShown(false)}>
      <Box
        sx={{ flexGrow: 1, display: "flex", alignItems: "center", backgroundColor: theme.bg.primary, borderRadius: "60px", px: 2, height: "50px" }}
      >
        <React.Suspense fallback={<>...</>}>
          <EmojiPicker inputRef={inputRef} showEmoji={showEmoji} isEmojiShown={isEmojiShown} messageHandler={messageHandler} />
        </React.Suspense>

        <InputBase
          inputRef={inputRef}
          value={value}
          onChange={(e) => messageHandler(e.target.value)}
          {...inputProps}
          placeholder="Type a message"
          style={{ padding: "0px 10px", flex: 1, height: "100%" }}
        />
        <LinkIcon style={{ cursor: "pointer" }} />
      </Box>
    </ClickAwayListener>
  );
};

export default function SendMessage(props) {
  const { conversationId, conversationUser, socket } = props;
  const [message, setMessage] = useState("");
  const { user } = useSelector((state) => state.userReducer);
  const { conversations } = useSelector((state) => state.conversationReducer);
  const { messages } = useSelector((state) => state.messageReducer);
  const dispatch = useDispatch();
  const { sendRequest } = useAxios();
  const { sendRequest: patchUnreadMessages } = useAxios();
  const { sendRequest: postNewConversation } = useAxios();
  const theme = useTheme();

  const sendMessage = async (e) => {
    e.preventDefault();
    setMessage("");

    let newConversationId;
    let newMessage;
    try {
      if (!conversationId) {
        const newConversation = await postNewConversation("/conversations", "POST", { senderId: user.userId, receiverId: conversationUser.userId });
        newConversationId = newConversation._id;
      }
      newMessage = await sendRequest("/messages", "POST", {
        conversationId: newConversationId || conversationId,
        sender: user.userId,
        text: message,
      });

      //check if message sent
      if (!newMessage.conversationId) return;

      const updatedMessages = [...messages, newMessage];
      dispatch(updateMessages(updatedMessages));

      const currentDateTime = new Date();
      const temp = conversations.map((item) =>
        item.conversationId === conversationId ? { ...item, lastMessage: newMessage, updatedAt: currentDateTime.toString() } : item
      );
      temp.sort((a, b) => {
        const dateA = new Date(a.updatedAt);
        const dateB = new Date(b.updatedAt);
        return dateB - dateA;
      });
      dispatch(updateConversations(temp));

      if (newConversationId) {
        dispatch(searchHandler(""));
        dispatch(changeActiveConversation({ conversationId: newConversationId, conversationUser }));
        socket.emit("sendMessage", { senderDetails: user, receiver: conversationUser.userId, message: newMessage });
      } else {
        socket.emit("sendMessage", { message: newMessage, receiver: conversationUser.userId });
      }
    } catch (err) {}
  };

  const messageFocusHandler = async () => {
    const unreadMessagesCount = conversations?.find((item) => item.conversationId === conversationId)?.unreadMessages;

    // If not new conversation
    if (conversationId && unreadMessagesCount > 0) {
      const temp = conversations.map((item) => (item.conversationId === conversationId ? { ...item, unreadMessages: 0 } : item));
      dispatch(updateConversations(temp));

      await patchUnreadMessages(`/messages/unread/${conversationId}`, "PATCH");
    }
  };

  // const sendVoiceNote = () => {};

  const messageHandler = useCallback((message) => {
    setMessage(message);
  }, []);

  return (
    <Box sx={{ p: "20px", backgroundColor: theme.bg.secondary }}>
      <Box component={"form"} onSubmit={sendMessage} sx={{ display: "flex", gap: 2 }}>
        <TextField conversationId={conversationId} onFocus={messageFocusHandler} value={message} messageHandler={messageHandler} />
        <IconButton
          sx={{
            width: "50px",
            height: "50px",
            backgroundColor: theme.palette.primary.main,
            "&:hover": { backgroundColor: "rgba(97, 197, 84, 0.8)" },
          }}
          type="submit"
        >
          {message ? <SendIcon /> : <VoiceIcon />}
        </IconButton>
      </Box>
    </Box>
  );
}
