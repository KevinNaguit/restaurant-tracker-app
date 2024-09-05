import React, { useState, useContext } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { LoggedInUserContext } from "../../contexts/LoggedInUserContext";

// Styled components for the sidebar layout including navigation and link styling

const SidebarContainer = styled.nav`
  width: 300px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  background-color: #fff4ed;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  overflow: hidden;
`;

const NavbarMain = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const NavbarFooter = styled.div`
  padding-top: 16px;
  border-top: 1px solid #ffdec5;
  margin-top: 16px;
  margin-bottom: 24px;
`;

const NavbarHeader = styled.div`
  padding-bottom: 16px;
  margin-bottom: 24px;
  border-bottom: 1px solid #ffdec5;
  display: flex;
  align-items: center;
  color: #fff;
`;

const AppTitle = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #0d0d0d;
  margin: 0;
`;

const NavList = styled.div`
  display: flex;
  flex-direction: column;
`;

const NavIcon = styled.img`
  width: 40px;
  height: auto;
  margin-right: 8px;
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  font-size: 16px;
  color: var(--secondary-color);
  padding: 8px 12px;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--primary-hover-color);
    color: #fff;
  }

  &.active {
    background-color: #ffd2b2;
    color: var(--primary-hover-color);
  }
`;

const ListsTitle = styled.h2`
  font-size: 16px;
  color: #929292;
  font-weight: bold;
`;

// Sidebar component for navigating between different sections of the app and logging out
const Sidebar = ({ activeItem, setActiveItem }) => {
  const { logout } = useContext(LoggedInUserContext);

  return (
    <SidebarContainer>
      <NavbarMain>
        <NavbarHeader>
          <AppTitle>My restaurantTrackerApp</AppTitle>
        </NavbarHeader>
        <ListsTitle>Lists</ListsTitle>
        <NavList>
          <NavLink
            to="/dashboard/favourites"
            className={activeItem === "Favourites" ? "active" : ""}
            onClick={() => setActiveItem("Favourites")}
          >
            <NavIcon
              src="/assets/icons8-delicious-64.png"
              alt="Favourites Icon"
            />
            Favourites
          </NavLink>
          <NavLink
            to="/dashboard/want-to-try"
            className={activeItem === "Want to Try" ? "active" : ""}
            onClick={() => setActiveItem("Want to Try")}
          >
            <NavIcon
              src="/assets/icons8-restaurant-64.png"
              alt="Want to Try Icon"
            />
            Want to Try
          </NavLink>
          <NavLink
            to="/dashboard/tags"
            className={activeItem === "Tags" ? "active" : ""}
            onClick={() => setActiveItem("Tags")}
          >
            <NavIcon src="/assets/icons8-promotion-64.png" alt="Tags Icon" />
            Tags
          </NavLink>
        </NavList>
      </NavbarMain>
      <NavbarFooter>
        <NavLink
          to="/"
          onClick={() => {
            logout();
          }}
        >
          <NavIcon
            src="/assets/icons8-delivery-bike-64.png"
            alt="Logout Icon"
          />
          Logout
        </NavLink>
      </NavbarFooter>
    </SidebarContainer>
  );
};

export default Sidebar;
