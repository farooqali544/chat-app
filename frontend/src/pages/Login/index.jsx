import { Box, Button, Link } from "@mui/material";
import { useForm } from "react-hook-form";
import { Link as RouterLink } from "react-router-dom";
import { useAxios } from "../../shared/hooks/useAxios";
import Alert from "../../components/shared/Alert";
import { Text } from "../../components/shared/Text";
import { useContext, useState } from "react";
import Input from "../../components/shared/Input";
import { useDispatch, useSelector } from "react-redux";
import { login, setUser } from "../../redux/reducers/userReducer";
import { DarkModeContext } from "../../shared/context/DarkModeContext";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit } = useForm();
  const { sendRequest, isLoading, error, clearError } = useAxios();
  const {darkMode} = useContext(DarkModeContext);
  // const user = useSelector((state) => state.userReducer.user);
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    let user;
    try {
      user = await sendRequest("/users/login", "POST", data);
      dispatch(login({ token: user.token }));
    } catch (err) {}
  };

  const showPasswordHandler = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Alert message={error} onClear={clearError} />
      <Box sx={{ display: "flex", backgroundColor: darkMode?"black":"white", height: "100%", width: "100%" }}>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ m: "auto", display: "flex", p: 2, flexDirection: "column", width: "100%", maxWidth: "400px", overflow: "hidden" }}
        >
          <Text variant="main" color={darkMode?"white":"black"} style={{ textAlign: "center", fontSize: "1.5rem" }}>
            Login to your account
          </Text>

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Text variant="regular" color={darkMode?"white":"black"} style={{ fontSize: "1.2rem" }}>
              Don't have an account?
            </Text>
            <Link component={RouterLink} to="/signup" sx={{ ml: 1, fontSize: "1.2rem" }}>
              Sign Up
            </Link>
          </Box>

          <Input label="Email Address" type="email" register={register} name="email" />
          <Input
            label="Password"
            showPassword={showPassword}
            showPasswordHandler={showPasswordHandler}
            type={showPassword ? "text" : "password"}
            register={register}
            name="password"
          />

          <Button type="submit" variant="contained" sx={{ mt: 3, fontWeight: 600 }} disabled={isLoading}>
            {isLoading ? "wait.." : "Login"}
          </Button>
        </Box>
      </Box>
    </>
  );
}
