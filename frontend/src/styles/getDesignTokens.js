export const getDesignTokens = (mode = "light") => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // palette values for light mode
          primary: { main: "#61C554" },
          secondary: { main: "#E8ECEF" },
          text: {
            primary: "#000000",
            secondary: "#000000",
          },
        }
      : {
          // palette values for dark mode
          primary: { main: "#61C554" },
          secondary: { main: "#131313" },
          text: {
            primary: "#E1E1E1",
            secondary: "#D0D0D0",
          },
        }),

    button: {
      main: "#969696",
    },
  },
  typography: {
    fontFamily: ["sans-serif", "titillium-web"],
  },

  text: {
    primary: "black",
    secondary: "#A1A1A1",
    tertiary: "#727272",
  },

  bg: {
    ...(mode === "light"
      ? {
          primary: "white",
          secondary: "#F1F4F7",
        }
      : {
          primary: "#131313",
          secondary: "#000000",
        }),
  },
});
