import { Button, Divider, IconButton, TextField, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { Text } from "../../shared/Text";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar } from "../../../components/shared/Avatar";
import { ReactComponent as NotFoundIcon } from "../../../assets/svgs/Block.svg";
import { useAxios } from "../../../shared/hooks/useAxios";
import { useSelector } from "react-redux";
import { SearchUser } from "./SearchUser";

const AddContact = React.memo(function AddContact(props) {
  const { open, closeAddContactForm } = props;
  const [contact, setContact] = useState();
  const [contactAdded, setContactAdded] = useState(false);
  const theme = useTheme();
  const { sendRequest, isLoading, error, clearError } = useAxios();
  const { user } = useSelector((state) => state.userReducer);

  const onChangeSearch = (data) => {
    clearError();
    setContactAdded(false);
    setContact(data);
  };

  const onAddContact = async () => {
    try {
      await sendRequest("/users/addContact", "PATCH", { uid: user.userId, contactId: contact._id });
      setContactAdded(true);
    } catch (err) {}
  };

  return (
    <Box
      sx={{
        position: "absolute",
        left: 0,
        top: 0,
        backgroundColor: theme.bg.primary,
        width: "100%",
        height: "100%",
        zIndex: 2,
        maxWidth: open ? "350px" : "0px",
        overflow: "hidden",
        transition: "all 0.3s ease",
      }}
    >
      <Box sx={{ width: "350px" }}>
        <Box sx={{ px: 2, height: "72px", display: "flex", gap: 2.5, alignItems: "center" }}>
          <IconButton onClick={closeAddContactForm}>
            <ArrowBackIcon />
          </IconButton>
          <Text variant="main" color={theme.palette.text.primary}>
            Add Contact
          </Text>
        </Box>
        <Divider />

        <SearchUser onChangeSearch={onChangeSearch} />

        {contact === null && (
          <Box sx={{ mt: 3, px: 2, display: "flex", alignItems: "center", gap: 2 }}>
            <NotFoundIcon style={{ flexShrink: 0 }} />
            <Text variant="regular" color={theme.palette.text.primary}>
              No such account found with entered email, Try another email
            </Text>
          </Box>
        )}

        {contact && (
          <>
            <Box sx={{ mt: 3, px: 2 }}>
              <Avatar src={contact.image} size={100} style={{ mx: "auto" }} />
              <Text variant="main" color={theme.palette.text.primary} style={{ textAlign: "center", mt: 2 }}>
                {contact.name}
              </Text>
            </Box>

            <Box sx={{ mt: 3, px: 2, display: "flex", flexDirection: "column", justifyContent: "center", gap: 2, alignItems: "center" }}>
              {!contactAdded && (
                <Button disabled={isLoading} onClick={onAddContact} sx={{ flexShrink: 0 }} variant="contained">
                  Add Contact
                </Button>
              )}
              {error && (
                <Text color="#f91f1f" variant="bold">
                  {error}
                </Text>
              )}
              {contactAdded && <Text color="white">Contact Added.</Text>}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
});
export default AddContact;
