import React from "react";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

const Alert = React.memo(function Alert(props) {
  const { message, onClear, type = "error" } = props;

  return (
    <Snackbar open={!!message} autoHideDuration={6000} onClose={onClear}>
      <MuiAlert onClose={onClear} severity={type}>
        {message}
      </MuiAlert>
    </Snackbar>
  );
});
export default Alert;
