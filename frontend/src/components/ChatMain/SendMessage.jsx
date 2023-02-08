import { Box, ClickAwayListener, IconButton, InputBase, useTheme } from "@mui/material";
import { ReactComponent as LinkIcon } from "../../assets/svgs/Paperclip.svg";
import { ReactComponent as VoiceIcon } from "../../assets/svgs/Microphone.svg";
import SendIcon from "@mui/icons-material/Send";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { sendMessage } from "../../redux/slices/messages";
import { useContext } from "react";
import { SocketContext } from "../../shared/context/SocketContext";

const EmojiPicker = React.lazy(() => import("./EmojiPicker"));

const TextField = (props) => {
  const { conversationId, messageHandler, value, ...inputProps } = props;
  const [isEmojiShown, setIsEmojiShown] = useState(false);
  const theme = useTheme();
  const inputRef = useRef(null);

  const showEmoji = useCallback(() => {
    setIsEmojiShown(true);
  }, []);

  // useEffect(() => {
  //   inputRef?.current?.focus();
  // }, [conversationId, inputRef]);

  return (
    <ClickAwayListener onClickAway={() => setIsEmojiShown(false)}>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          backgroundColor: theme.bg.primary,
          borderRadius: "60px",
          border: `1px solid rgba(255,255,255,0.5)`,
          px: 2,
        }}
      >
        <React.Suspense fallback={<>...</>}>
          <EmojiPicker
            inputRef={inputRef}
            showEmoji={showEmoji}
            isEmojiShown={isEmojiShown}
            messageHandler={messageHandler}
          />
        </React.Suspense>

        <InputBase
          inputRef={inputRef}
          value={value}
          multiline
          maxRows={3}
          onChange={(e) => messageHandler(e.target.value)}
          {...inputProps}
          placeholder="Type a message"
          sx={{ py: "10px", flex: 1 }}
        />
        <LinkIcon style={{ cursor: "pointer" }} />
      </Box>
    </ClickAwayListener>
  );
};

export default function SendMessage(props) {
  const { activeConversation } = props;
  const [message, setMessage] = useState("");
  const theme = useTheme();
  const dispatch = useDispatch();
  const { socket_sendMessage } = useContext(SocketContext);

  const onSendMessage = (e) => {
    e.preventDefault();
    if(!message) return;
    dispatch(sendMessage({ conversationId: activeConversation._id, text: message }))
      .unwrap()
      .then((response) => {
        socket_sendMessage({ receiverId: activeConversation.members[0]._id, ...response });
        setMessage("");
      });
  };

  const messageFocusHandler = async () => {};

  // const sendVoiceNote = () => {};

  const messageHandler = useCallback((message) => {
    setMessage(message);
  }, []);

  return (
    <Box sx={{ p: "20px", backgroundColor: theme.bg.secondary }}>
      <Box component={"form"} onSubmit={onSendMessage} sx={{ display: "flex", gap: 2 }}>
        <TextField
          // conversationId={conversationId}
          onFocus={messageFocusHandler}
          value={message}
          messageHandler={messageHandler}
        />
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
