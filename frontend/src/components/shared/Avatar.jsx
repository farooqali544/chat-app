import { Box } from "@mui/material";
import React, { useState } from "react";
import AvatarImage from "../../assets/images/Farooq.jpg";
import { ReactComponent as OnlineIcon } from "../../assets/svgs/Online.svg";

export const Avatar = React.memo((props) => {
  const { src, size, online, style, imgStyle } = props;
  const [isLoaded, setIsLoaded] = useState(false);
  const imageSource = src && isLoaded ? src : AvatarImage;

  return (
    <Box sx={{ flexShrink: 0, position: "relative", width: size ? size : "50px", height: size ? size : "50px", ...style }}>
      <img
        src={imageSource}
        onLoad={() => src && setIsLoaded(true)}
        alt="avatar"
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          backgroundColor: src && !isLoaded ? "gray" : "transparent",
          objectFit: "cover",
          ...imgStyle,
        }}
      />
      {online && <OnlineIcon style={{ position: "absolute", top: "60%", right: "-3px" }} />}
    </Box>
  );
});
