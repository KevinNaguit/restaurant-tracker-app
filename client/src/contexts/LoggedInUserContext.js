import { createContext, useState } from "react";

export const LoggedInUserContext = createContext();

const LoggedInUserProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Function to handle user login by sending credentials to the server,
  // updating state if successful or logging errors
  const login = async (email, password) => {
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const user = await response.json();
        setLoggedInUser(user.data);
      } else {
        console.error("Login failed:", response.statusText);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  // Function to log out a user
  const logout = () => setLoggedInUser(null);

  return (
    <LoggedInUserContext.Provider value={{ loggedInUser, login, logout }}>
      {children}
    </LoggedInUserContext.Provider>
  );
};

export default LoggedInUserProvider;
