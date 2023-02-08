import { Box, Button, IconButton } from "@mui/material";
import { Text } from "../../components/shared/Text";
import AddIcon from "@mui/icons-material/Add";
import { ReactComponent as AvatarIcon } from "../../assets/svgs/AvatarAddPic.svg";
import { useState } from "react";
import { Avatar } from "../../components/shared/Avatar";
import storage from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { useAxios } from "../../shared/hooks/useAxios";
import Alert from "../../components/shared/Alert";
import { useDispatch } from "react-redux";
// import { login } from "../../redux/slices/userReducer";

export default function AddProfilePic(props) {
  const { createdUser } = props;
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { sendRequest, error, clearError } = useAxios();
  const dispatch = useDispatch();

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const fileName = image.name;
    const imageRef = ref(storage, `profilePics/${fileName + v4()}`);
    setIsLoading(true);
    let uploadedImageUrl;
    try {
      await uploadBytes(imageRef, image).then(async (resp) => {
        await getDownloadURL(imageRef).then((response) => {
          uploadedImageUrl = response;
        });
      });

      await sendRequest(`/users/updateProfilePic/${createdUser.userId}`, "PATCH", { image: uploadedImageUrl });
      // dispatch(login({ token: createdUser.token }));
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  const onSkip = () => {
    // dispatch(login({ token: createdUser.token }));
  };

  return (
    <>
      <Alert message={error} onClear={clearError} />
      <Box
        component={"form"}
        onSubmit={onSubmit}
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
        <Button sx={{ ml: "auto" }} onClick={onSkip}>
          Skip
        </Button>
        <Text variant="main" color="white" style={{ textAlign: "center", fontSize: "1.5rem", mt: 3 }}>
          Welcome {createdUser?.firstName} {createdUser?.lastName}
        </Text>

        <Box sx={{ position: "relative", m: "30px auto" }}>
          {!image && <AvatarIcon width={150} height={150} />}

          {/* Url.createObjectUrl ---> convert file to url */}
          {image && <Avatar src={URL.createObjectURL(image)} imgStyle={{ objectFit: "contain", borderRadius: 0 }} alt="profile Pic" size={200} />}

          <IconButton
            component="label"
            htmlFor="input_image"
            id="inputImage"
            size="medium"
            sx={{ position: "absolute", bottom: 0, right: 0, backgroundColor: "white", "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" } }}
          >
            <AddIcon fontSize="large" color="primary" />
          </IconButton>

          <input onChange={imageHandler} type="file" id="input_image" accept=".jpg, .jpeg, .png" style={{ display: "none" }} />
        </Box>

        <Text color="white" variant="bold" style={{ textAlign: "center", fontSize: "1.1rem" }}>
          You're all set
        </Text>
        <Text color="white" style={{ textAlign: "center", fontSize: "1.1rem" }}>
          Take a minute to upload a profile photo
        </Text>

        <Button variant="contained" sx={{ mt: 3 }} disabled={!image || isLoading} type="submit">
          {isLoading ? "Wait.." : "Add"}
        </Button>
      </Box>
    </>
  );
}
