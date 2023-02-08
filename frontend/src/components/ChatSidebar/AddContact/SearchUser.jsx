import { useTheme } from "@emotion/react";
import { Box, TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import { resetSearchUsers, searchUsers } from "../../../redux/slices/searchUsers";
import { Text } from "../../shared/Text";

export function SearchUser(props) {
  const theme = useTheme();
  const dispatch = useDispatch();

  const searchHandler = (e) => {
    if (!e.target.value) return dispatch(resetSearchUsers());

    dispatch(searchUsers(e.target.value));
  };

  return (
    <Box sx={{ mt: 3, px: 2 }}>
      <Text variant="bold" color={theme.palette.text.primary}>
        Search Users By Name or Email
      </Text>
      <TextField
        onChange={searchHandler}
        fullWidth
        size="small"
        sx={{ mt: 1 }}
        placeholder="Name or Email"
      />
    </Box>
  );
}
