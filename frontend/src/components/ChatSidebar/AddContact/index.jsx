import { memo } from "react";
import { Divider, IconButton, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import { Text } from "../../shared/Text";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar } from "../../../components/shared/Avatar";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import { SearchUser } from "./SearchUser";
import { useDispatch, useSelector } from "react-redux";
import { addContact, removeContact } from "../../../redux/slices/searchUsers";


const AddContact = memo(function AddContact(props) {
  const { open, closeAddContactForm } = props;
  const searchUsers = useSelector((state) => state.searchUsers);
  const theme = useTheme();
  const dispatch = useDispatch();

  const onAddContact = async (id) => {
    dispatch(addContact(id));
  };

  const onRemoveContact = async (id) => {
    dispatch(removeContact(id));
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

        <SearchUser />

        <Box sx={{ px: 2 }}>
          {searchUsers.data.map((user) => (
            <Box sx={{ mt: 4, display: "flex", alignItems: "center" }}>
              <Avatar src={user.image} />
              <Box sx={{ ml: "15px" }}>
                <Text variant="main" color={theme.palette.text.primary}>
                  {user.name}
                </Text>
                <Text variant="regular" color={theme.palette.text.secondary}>
                  {user.email}
                </Text>
              </Box>

              {user.isContact ? (
                <IconButton
                  sx={{ ml: "auto" }}
                  color="primary"
                  onClick={() => onRemoveContact(user._id)}
                >
                  <CheckIcon color="primary" />
                </IconButton>
              ) : (
                <IconButton
                  onClick={() => onAddContact(user._id)}
                  sx={{ ml: "auto" }}
                  color="primary"
                >
                  <AddIcon color="primary" />
                </IconButton>
              )}
            </Box>
          ))}
        </Box>

        {/* {contact === null && (
          <Box sx={{ mt: 3, px: 2, display: "flex", alignItems: "center", gap: 2 }}>
            <NotFoundIcon style={{ flexShrink: 0 }} />
            <Text variant="regular" color={theme.palette.text.primary}>
              No such account found with entered email, Try another email
            </Text>
          </Box>
        )} */}

        {/* {contact && (
          <>
            <Box sx={{ mt: 3, px: 2 }}>
              <Avatar src={contact.image} size={100} style={{ mx: "auto" }} />
              <Text
                variant="main"
                color={theme.palette.text.primary}
                style={{ textAlign: "center", mt: 2 }}
              >
                {contact.name}
              </Text>
            </Box>

            <Box
              sx={{
                mt: 3,
                px: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 2,
                alignItems: "center",
              }}
            >
              {!contactAdded && (
                <Button
                  // disabled={isLoading}
                  onClick={onAddContact}
                  sx={{ flexShrink: 0 }}
                  variant="contained"
                >
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
        )} */}
      </Box>
    </Box>
  );
});
export default AddContact;
