import { Box, Checkbox, Switch, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Text } from "../shared/Text";
import { Avatar } from "../shared/Avatar";
import { ReactComponent as VideoIcon } from "../../assets/svgs/Video.svg";
import { ReactComponent as CallIcon } from "../../assets/svgs/Call.svg";
import { ReactComponent as BlockIcon } from "../../assets/svgs/Block.svg";
import { ReactComponent as ReportIcon } from "../../assets/svgs/Report.svg";
import { ReactComponent as DeleteIcon } from "../../assets/svgs/Delete.svg";
import { ManageIcon } from "../shared/ManageIcon";
import FarooqImage from "../../assets/images/Farooq.jpg";
import { DarkModeContext } from "../../shared/context/DarkModeContext";
import { useContext } from "react";

const ManageButton = (props) => {
  const { icon: Icon, actionName } = props;
  const theme = useTheme();
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1.6 }}>
      <Icon />
      <Text color={theme.palette.text.primary} variant="main">
        {actionName}
      </Text>
    </Box>
  );
};

export default function ContactInfo() {
  const theme = useTheme();
  const { darkMode } = useContext(DarkModeContext);


  const closeContactInfo = () =>{
    
  }

  return (
    <Box
      sx={{
        flex: 1,
        maxWidth: "350px",
        transition: "max-width 0.2s ease-out",
        overflowX: "hidden",
        height: "100%",
        px: "20px",
        pb:'20px',
        backgroundColor: theme.bg.primary,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 3, overflowY: "auto" }}>
        <CloseIcon onClick = {closeContactInfo} sx={{ color: "gray", cursor: "pointer" }} id={darkMode && "light_svg"} />
        <Text variant="bold" color={theme.palette.text.primary}>
          Contact Info
        </Text>
      </Box>

      <Box sx={{ mt: "60px", display: "flex", flexDirection: "column", width: "100%", alignItems: "center" }}>
        <Avatar size="100px" />

        <Text variant="main" color={theme.palette.text.primary} style={{ fontSize: "22px", texAlign: "center", mt: "15px" }}>
          Zilan
        </Text>
        <Text variant="small" color="gray">
          Online
        </Text>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: 2, gap: 2 }}>
        <ManageIcon icon={VideoIcon} />
        <ManageIcon icon={CallIcon} />
      </Box>

      <Text variant="bold" color={theme.palette.text.primary} style={{ mt: 2 }}>
        About
      </Text>
      <Text variant="regular" noWrap color="gray" style={{ maxWidth: "300px" }}>
        Hello My name is Zilan Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laborum pariatur deserunt modi, voluptatum minima
        repellendus, laboriosam nulla, sunt corrupti quibusdam nesciunt quam quo id odit deleniti placeat veritatis omnis velit.
      </Text>

      <Box sx={{ mt: 2 }}>
        <Text variant="main" color={theme.palette.text.primary}>
          Media, links and doc
        </Text>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: "10px" }}>
          <img src={FarooqImage} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "5px" }} alt="media" />
          <img src={FarooqImage} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "5px" }} alt="media" />
          <img src={FarooqImage} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "5px" }} alt="media" />
          <img src={FarooqImage} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "5px" }} alt="media" />
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 3 }}>
        <Text variant="main" color={theme.palette.text.primary}>
          Mute Notifications
        </Text>
        <Switch size="large" />
      </Box>

      <Text variant="main" color={theme.palette.text.primary} style={{ mt: 2 }}>
        Disappearing Messages
      </Text>
      <Text variant="regular" color="gray" style={{ mt: 1, mb: 2 }}>
        Off
      </Text>

      <ManageButton icon={BlockIcon} actionName="Block Zilan" />
      <ManageButton icon={ReportIcon} actionName="Report Zilan" />
      <ManageButton icon={DeleteIcon} actionName="Delete Chat" />
    </Box>
  );
}
