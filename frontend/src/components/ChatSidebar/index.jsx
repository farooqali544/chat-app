import { Box, useTheme } from "@mui/material";
import React, { useState } from "react";
import SidebarHeader from "./SidebarHeader";
import SearchBox from "./SearchBox";
import Status from "./Status";
import ChatList from "./ChatList";
import { useContext } from "react";
import { DarkModeContext } from "../../shared/context/DarkModeContext";
import AddContact from "./AddContact";
import { SearchList } from "./SearchList";
import { useSelector } from "react-redux";
import { useCallback } from "react";

export function ChatSidebar() {
  const theme = useTheme();
  const { darkMode } = useContext(DarkModeContext);
  const { searchValue } = useSelector((state) => state.contactReducer);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);

  const openAddContactForm = useCallback(() => {
    setIsAddContactOpen(true);
  }, []);

  const closeAddContactForm = useCallback(() => {
    setIsAddContactOpen(false);
  }, []);

  return (
    <>
      <AddContact open={isAddContactOpen} closeAddContactForm={closeAddContactForm} />
      <Box
        sx={{
          flex: 1,
          maxWidth: "350px",
          display: "flex",
          flexDirection: "column",
          borderRight: !darkMode && `1px solid #F2F2F2`,
          transition: "max-width 1s ease",
          backgroundColor: theme.bg.primary,
        }}
      >
        <SidebarHeader openAddContactForm={openAddContactForm} />

        <SearchBox />

        {searchValue ? (
          <SearchList />
        ) : (
          <>
            <Status />

            <ChatList />
          </>
        )}
      </Box>
    </>
  );
}
