import React from "react";
import styled from "styled-components";
import GlobalStyles from "../../GlobalStyles";

// Styled components
const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 1rem;
`;

// Dashboard Component
const Dashboard = () => {
  return (
    <DashboardContainer>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard!</p>
    </DashboardContainer>
  );
};

export default Dashboard;
