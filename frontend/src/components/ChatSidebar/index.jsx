import { Box, useTheme } from "@mui/material";
import React, { useState } from "react";
import SidebarHeader from "./SidebarHeader";
import SearchBox from "./SearchBox";
import { useContext } from "react";
import { DarkModeContext } from "../../shared/context/DarkModeContext";
import AddContact from "./AddContact";
import { useCallback } from "react";
import SearchList from "./SearchList";
import Status from "./Status";
import ChatList from "./ChatList";

export function ChatSidebar() {
  const theme = useTheme();
  const [searchValue, setSearchValue] = useState("");
  const { darkMode } = useContext(DarkModeContext);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);

  const searchValueHandler = (value) =>{
    setSearchValue(value);
  }

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

        <SearchBox searchValue = {searchValue} searchValueHandler = {searchValueHandler} />

        

        {searchValue ? (
          <SearchList searchValue={searchValue}/>
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
