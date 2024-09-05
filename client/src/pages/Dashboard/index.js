import React, { useContext, useState } from "react";
import styled from "styled-components";
import GlobalStyles from "../../GlobalStyles";
import { LoggedInUserContext } from "../../contexts/LoggedInUserContext";
import { useLocation } from "react-router-dom";
import Sidebar from "../Sidebar";
import MainContent from "../MainContent";

const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

const Dashboard = () => {
  const { loggedInUser, logout } = useContext(LoggedInUserContext);
  const [activeItem, setActiveItem] = useState("Favourites");

  // Check if the current url path is the dashboard to conditionally show content
  const location = useLocation();
  const showCenteredContent = location.pathname === "/dashboard";

  return (
    <>
      <GlobalStyles />
      <DashboardContainer>
        <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
        <MainContent
          showCenteredContent={showCenteredContent}
          loggedInUser={loggedInUser}
        />
      </DashboardContainer>
    </>
  );
};

export default Dashboard;
