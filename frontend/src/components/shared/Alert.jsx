import React from "react";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { useState } from "react";
import { useEffect } from "react";

const Alert = React.memo(function Alert(props) {
  const { message, type = "error" } = props;
  const [open, setOpen] = useState(false);
  

  useEffect(() => {
    if (!!message) setOpen(true);
    else setOpen(false);
  }, [message]);

  const onClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ horizontal: "center", vertical: "top" }}
    >
      <MuiAlert onClose={onClose} severity={type}>
        {message}
      </MuiAlert>
    </Snackbar>
  );
});
export default Alert;
