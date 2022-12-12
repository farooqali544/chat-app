import { Box, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import React, { useState } from "react";
import { Avatar } from "../shared/Avatar";
import { ReactComponent as ExpandDownIcon } from "../../assets/svgs/Expand_down.svg";
import { ReactComponent as EditIcon } from "../../assets/svgs/Edit.svg";
import { ReactComponent as DarkModeIcon } from "../../assets/svgs/DarkMode.svg";
import { useContext } from "react";
import { DarkModeContext } from "../../shared/context/DarkModeContext";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/reducers/userReducer";
import { setInitialContact } from "../../redux/reducers/contactReducer";
import { setInitialConversation } from "../../redux/reducers/conversationReducer";

const SidebarHeader = React.memo(function SidebarHeader(props) {
  const { openAddContactForm } = props;
  const { darkMode, toggleColorMode } = useContext(DarkModeContext);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const { user } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();

  const openMenu = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setMenuAnchorEl(null);
  };

  const isMenuOpen = Boolean(menuAnchorEl);

  const addContactHandler = () => {
    openAddContactForm();
    closeMenu();
  };

  const logoutHandler = () => {
    dispatch(setInitialContact());
    dispatch(setInitialConversation());
    dispatch(setInitialContact());
    dispatch(logout());
  };

  return (
    <Box
      sx={{
        mt: "25px",
        px: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Avatar size={40} src={user?.image} />

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton>
          <EditIcon id={darkMode ? "light_svg" : ""} />
        </IconButton>
        <Tooltip placement="bottom" title={darkMode ? "Light Mode" : "Dark Mode"}>
          <IconButton onClick={() =>toggleColorMode()}>
            <DarkModeIcon id={darkMode ? "light_svg" : "moon-alt"} />
          </IconButton>
        </Tooltip>
        <IconButton onClick={openMenu}>
          <ExpandDownIcon id={darkMode ? "light_svg" : ""} />
        </IconButton>
        <Menu
          anchorEl={menuAnchorEl}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={isMenuOpen}
          onClose={closeMenu}
          sx={{ right: 0 }}
        >
          <MenuItem onClick={addContactHandler}>Add Contact</MenuItem>
          <MenuItem onClick={logoutHandler}>Log Out</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
});

export default SidebarHeader;
