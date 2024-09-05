import React from "react";
import styled from "styled-components";
import { Outlet } from "react-router-dom";

// Styled components for layout and styling of main content, logo, welcome text and icons

const MainContentContainer = styled.div`
  flex-grow: 1;
  margin-left: 300px;
  padding: 2rem;
  background-color: #fafbfb;
  color: #0d0d0d;
  min-height: 100vh;
  overflow-y: auto;
  // Conditional styling for layout and alignment based on whether content should be centered
  display: ${({ showCenteredContent }) =>
    showCenteredContent ? "flex" : "block"};
  flex-direction: ${({ showCenteredContent }) =>
    showCenteredContent ? "column" : "initial"};
  align-items: ${({ showCenteredContent }) =>
    showCenteredContent ? "center" : "initial"};
  justify-content: ${({ showCenteredContent }) =>
    showCenteredContent ? "center" : "initial"};
  text-align: ${({ showCenteredContent }) =>
    showCenteredContent ? "center" : "initial"};
`;

const CenteredLogo = styled.img`
  width: 140px;
  height: 140px;
  margin-bottom: 16px;
`;

const WelcomeText = styled.h2`
  font-size: 24px;
  color: #0d0d0d;
  margin: 0;
`;

const Icon = styled.img`
  width: 40px;
  height: auto;
  margin-right: 8px;
`;

// Main Content component to display centered welcome text content/regular layout based on props
const MainContent = ({ showCenteredContent, loggedInUser }) => {
  return (
    <MainContentContainer showCenteredContent={showCenteredContent}>
      {showCenteredContent && (
        <>
          <CenteredLogo src="/assets/blobbyMenu.png" alt="Logo" />
          <WelcomeText>
            Hello, {loggedInUser ? loggedInUser.username : "food lover"}! It's
            time to satisfy those cravings.
            <Icon src="/assets/icons8-hungry-64.png" alt="Favourites Icon" />
            <br />
            Head over to your lists to browse your favourite spots and add new
            ones!
            <Icon
              src="/assets/icons8-restaurant-64-platter.png"
              alt="Favourites Icon"
            />
          </WelcomeText>
        </>
      )}
      <Outlet />
    </MainContentContainer>
  );
};

export default MainContent;
