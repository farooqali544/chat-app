import { InputBase, styled, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as SearchIcon } from "../../assets/svgs/Search.svg";
import { searchHandler } from "../../redux/reducers/contactReducer";
import { DarkModeContext } from "../../shared/context/DarkModeContext";

const StyledInputWrapper = styled(Box, {
  shouldForwardProp: (props) => props !== "isFocused" && props !== "darkMode",
})(({ theme, isFocused, darkMode }) => ({
  margin: "0px 20px",
  marginTop: "20px",
  padding: "0px 16px",
  backgroundColor: darkMode ? "black" : "#F2F3F5",
  borderRadius: "70px",
  height: "40px",
  display: "flex",
  alignItems: "center",
  border: "1px solid transparent",
  borderColor: isFocused ? theme.palette.primary.main : "transparent",
}));

const SearchBox = React.memo(function SearchBox() {
  const [isFocused, setIsFocused] = useState(false);
  const { searchValue } = useSelector((state) => state.contactReducer);
  const dispatch = useDispatch();
  const { darkMode } = useContext(DarkModeContext);


  return (
    <StyledInputWrapper isFocused={isFocused} darkMode={darkMode} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}>
      <SearchIcon id={darkMode ? "light_svg" : ""} />
      <InputBase
        value={searchValue}
        onChange={(e) => dispatch(searchHandler(e.target.value))}
        sx={{ width: "100%", px: "10px", height: "100%", fontSize: "14px" }}
        placeholder="Search or start a new chat"
      />
    </StyledInputWrapper>
  );
});
export default SearchBox;
