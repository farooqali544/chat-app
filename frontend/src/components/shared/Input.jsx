import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { IconButton, InputAdornment, TextField } from "@mui/material";

export default function Input(props) {
  const { register, name, label, showPassword, showPasswordHandler, ...restProps } = props;
  const endIcon = name === "password" && (
    <InputAdornment position="end" onClick={showPasswordHandler}>
      <IconButton>{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton>
    </InputAdornment>
  );
  return (
    <TextField
      InputProps={name === "password" ? { minLength: 5, endAdornment: endIcon } : {}}
      {...restProps}
      sx={{ mt: 3,  }}
      variant="filled"
      placeholder={label}
      required
      {...register(name)}
    />
  );
}
