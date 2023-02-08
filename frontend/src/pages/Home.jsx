import React, { useContext, useEffect } from "react";
import ChatMain from "../components/ChatMain";
import { ChatSidebar } from "../components/ChatSidebar";
import ContactInfo from '../components/ContactInfo/index'
import { useSelector } from "react-redux";

export default function Home() {
  // const auth = useSelector((state) => state.auth);

  return (
    <div className="wrapper">
      <ChatSidebar />

      <ChatMain />

      {/* <ContactInfo /> */}
    </div>
  );
}
