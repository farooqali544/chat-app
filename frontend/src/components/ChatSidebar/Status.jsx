import { Box } from "@mui/system";
import React from "react";
import { Text } from "../shared/Text";
import { ReactComponent as EllipsesIcon } from "../../assets/svgs/Ellipses.svg";
import { ReactComponent as AddIcon } from "../../assets/svgs/Add.svg";
import { Avatar } from "../shared/Avatar";
import { IconButton, useTheme } from "@mui/material";
import { useHorizontalScroll } from "../../shared/hooks/useHorizontalScroll";
import { useContext } from "react";
import { DarkModeContext } from "../../shared/context/DarkModeContext";
import { ReactComponent as ArrowRightIcon } from "../../assets/svgs/ArrowRight.svg";
import { ReactComponent as ArrowLeftIcon } from "../../assets/svgs/ArrowLeft.svg";

const AddStatusCircle = () => {
  const { darkMode } = useContext(DarkModeContext);
  const theme = useTheme();
  return (
    <Box>
      <Box
        sx={{
          mb: "10px",
          backgroundColor: darkMode ? "#242424" : "#F2F2F2",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          position: "relative",
          display: "flex",
          flexShrink: 0,
          cursor: "pointer",
        }}
      >
        <EllipsesIcon
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
        <AddIcon style={{ margin: "auto" }} />
      </Box>
      <Text variant="bold" color={theme.palette.text.primary} style={{ textAlign: "center" }}>
        Add
      </Text>
    </Box>
  );
};

const StatusCircle = (props) => {
  const { seen } = props;
  const theme = useTheme();

  return (
    <Box>
      <Box
        sx={{
          mb: "10px",
          width: "56px",
          maxWidth: "56px",
          display: "flex",
          border: `1.5px solid  ${seen ? "darkGray" : theme.palette.primary.main}`,
          height: "56px",
          borderRadius: "50%",
          flexShrink: 0,
          cursor: "pointer",
        }}
      >
        <Avatar size={50} style={{ margin: "auto" }} />
      </Box>
      <Text variant="bold" color={theme.palette.text.primary} style={{ textAlign: "center" }}>
        Farooq
      </Text>
    </Box>
  );
};

const Status = React.memo(function Status() {
  const { scrollRef, scrollPosition, scroll } = useHorizontalScroll();
  const theme = useTheme();


  const onScrollLeft = () => {
    scroll("left");
  };

  const onScrollRight = () => {
    scroll("right");
  };

  return (
    <Box sx={{ mt: 3, position: "relative" }}>
      <Text variant="main" style={{ ml: "20px" }} color={theme.palette.text.primary}>
        STATUS
      </Text>

      {(scrollPosition === "middle" || scrollPosition === "right") && (
        <IconButton
          onClick={onScrollLeft}
          sx={{ fontSize: "10px", position: "absolute", zIndex: 1, top: "50%", transform: "translateY(-50%)", left: 0 }}
        >
          <ArrowLeftIcon width={28} height={28} />
        </IconButton>
      )}
      {(scrollPosition === "middle" || scrollPosition === "left") && (
        <IconButton onClick={onScrollRight} sx={{ position: "absolute", zIndex: 1, top: "50%", transform: "translateY(-50%)", right: 0 }}>
          <ArrowRightIcon width={28} height={28} />
        </IconButton>
      )}

      <Box
        className="status_scroller"
        ref={scrollRef}
        sx={{
          mt: "10px",
          display: "flex",
          alignItems: "center",
          gap: 2,
          px: "20px",
          overflow: "auto",
        }}
      >
        <AddStatusCircle />
        <StatusCircle seen />
        <StatusCircle />
        <StatusCircle />
        <StatusCircle />
        <StatusCircle />
        <StatusCircle />
        <StatusCircle />
        <StatusCircle />
        <StatusCircle />
        <StatusCircle />
        <StatusCircle />
        <StatusCircle />
        <StatusCircle />
        <StatusCircle />
        <StatusCircle />
        <StatusCircle />
      </Box>
    </Box>
  );
});

export default Status;
