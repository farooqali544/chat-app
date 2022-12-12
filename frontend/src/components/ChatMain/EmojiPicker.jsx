import { Box, IconButton } from "@mui/material";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { memo, useEffect, useState } from "react";
import { ReactComponent as EmojiIcon } from "../../assets/svgs/Smiley.svg";
import { useContext } from "react";
import { DarkModeContext } from "../../shared/context/DarkModeContext";

export default memo(function EmojiPicker({ inputRef, messageHandler, isEmojiShown, showEmoji }) {
  const [cursorPosition, setCursorPosition] = useState();
  const { darkMode } = useContext(DarkModeContext);

  const emojiHandler = ({ native: emoji }) => {
    const ref = inputRef.current;
    ref.focus();
    const start = ref.value.substring(0, ref.selectionStart);
    const end = ref.value.substring(ref.selectionStart);
    const msg = start + emoji + end;

    setCursorPosition(start.length + emoji.length);

    messageHandler(msg);
  };

  useEffect(() => {
    inputRef.current.selectionEnd = cursorPosition;
  }, [cursorPosition, inputRef]);

  return (
    <Box sx={{ position: "relative" }}>
      <IconButton
        onClick={() => {
          showEmoji(true);
        }}
      >
        <EmojiIcon style={{ marginRight: "5px", cursor: "pointer" }} />
      </IconButton>

      <Box sx={{ position: "absolute", bottom: "110%", display: isEmojiShown ? "default" : "none" }}>
        <Picker theme={darkMode ? "dark" : "light"} data={data} onEmojiSelect={emojiHandler} />
      </Box>
    </Box>
  );
});
