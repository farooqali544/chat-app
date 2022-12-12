import React from "react";
import { Typography } from "@mui/material";

const getSx = (variant) => {
  switch (variant) {
    case "main":
      return { fontSize: "16px", fontWeight: 700 };
    case "regular":
      return { fontSize: "14px", fontWeight: 400 };
    case "bold":
      return { fontSize: "14px", fontWeight: 700 };
    case "small":
      return { fontSize: "12px", fontWeight: 400 };
    default:
      return { fontSize: "16px", fontWeight: 400 };
  }
};

export const Text = React.memo((props) => {
  const { children, color = "black", variant = "regular", noWrap, style, ...rest } = props;

  return (
    <Typography
      {...rest}
      sx={{
        ...getSx(variant),
        color: color,
        whiteSpace: noWrap ? "nowrap" : "auto",
        textOverflow: noWrap ? "ellipsis" : "none",
        overflow: noWrap ? "hidden" : "visible",
        ...style,
      }}
    >
      {children}
    </Typography>
  );
});
