import { useTheme } from "@emotion/react";
import { Box, Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { useAxios } from "../../../shared/hooks/useAxios";
import { Text } from "../../shared/Text";

export function SearchUser(props) {
  const { onChangeSearch } = props;

  const [email, setEmail] = useState("");
  const theme = useTheme();
  const { sendRequest, isLoading, error, clearError } = useAxios();

  const onSubmit = async (e) => {
    e.preventDefault();

    let foundContact;
    try {
      foundContact = await sendRequest(`/users/email/${email}`, "GET");
      onChangeSearch(foundContact);
    } catch (err) {}
  };

  return (
    <Box sx={{ mt: 3, px: 2 }} component="form" onSubmit={onSubmit}>
      <Text variant="bold" color={theme.palette.text.primary}>
        Contact Email
      </Text>
      <TextField value={email} onChange={(e) => setEmail(e.target.value)} fullWidth size="small" sx={{ mt: 1 }} placeholder="Contact Email" />
      <Button type="submit" color="primary" fullWidth variant="contained" sx={{ fontWeight: 500, mt: 2 }}>
        Search
      </Button>
    </Box>
  );
}
