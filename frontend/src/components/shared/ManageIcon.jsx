import { useTheme } from "@emotion/react";
import { IconButton } from "@mui/material";
import React, { useContext } from "react";
import { DarkModeContext } from "../../shared/context/DarkModeContext";

export const ManageIcon = React.memo((props) => {
  const { icon: Icon } = props;
  const theme = useTheme();
  const { darkMode } = useContext(DarkModeContext);
  return (
    <IconButton sx={{ backgroundColor: darkMode ? "black" : "#F8F8F8", height: "38px", width: "38px" }} id={darkMode ? "light_svg" : ""}>
      <Icon />
    </IconButton>
  );
});
