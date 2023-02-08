import { Box, Button, Link } from "@mui/material";
import React, { useContext } from "react";
import { useState } from "react";
import { Text } from "../../components/shared/Text";
import AddProfilePic from "./AddProfilePic";
import { useForm } from "react-hook-form";
import { useAxios } from "../../shared/hooks/useAxios";
import Alert from "../../components/shared/Alert";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Input from "../../components/shared/Input";
import { DarkModeContext } from "../../shared/context/DarkModeContext";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../../redux/slices/auth";

export default function Signup() {
  const [createdUser, setCreatedUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit } = useForm();
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { darkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();

  const onSubmitForm = (data) => {
    dispatch(signup(data))
      .unwrap()
      .then(() => {
        navigate("/");
      });
  };

  const showPasswordHandler = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Alert message={auth.error} />
      <Box
        sx={{
          display: "flex",
          backgroundColor: darkMode ? "black" : "white",
          height: "100%",
          width: "100%",
        }}
      >
        <Box
          sx={{ m: "auto", display: "flex", width: "100%", maxWidth: "400px", overflow: "hidden" }}
        >
          <Box
            onSubmit={handleSubmit(onSubmitForm)}
            component="form"
            sx={{
              display: "flex",
              flexShrink: 0,
              width: "100%",
              p: 2,
              flexDirection: "column",
              transition: "all 0.3s ease",
              transform: createdUser && "translateX(-100%)",
            }}
          >
            <Text
              variant="main"
              color={darkMode ? "white" : "black"}
              style={{ textAlign: "center", fontSize: "1.5rem" }}
            >
              Create a new account
            </Text>

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Text
                variant="regular"
                color={darkMode ? "white" : "black"}
                style={{ fontSize: "1.2rem" }}
              >
                Already a user?
              </Text>
              <Link component={RouterLink} to="/login" sx={{ ml: 1, fontSize: "1.2rem" }}>
                Sign In
              </Link>
            </Box>

            <Input label="Name" register={register} name="name" />
            <Input label="Email Address" type="email" register={register} name="email" />
            <Input
              label="Password"
              showPassword={showPassword}
              showPasswordHandler={showPasswordHandler}
              type={showPassword ? "text" : "password"}
              register={register}
              name="password"
            />

            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 3, fontWeight: 600 }}
              disabled={auth.loading}
            >
              {auth.loading ? "wait.." : "Sign up"}
            </Button>
          </Box>
          <AddProfilePic createdUser={createdUser} />
        </Box>
      </Box>
    </>
  );
}
