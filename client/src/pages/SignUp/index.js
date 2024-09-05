import React, { useState, useContext } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import GlobalStyles from "../../GlobalStyles";
import { LoggedInUserContext } from "../../contexts/LoggedInUserContext";

// Styled components for styling the sign-up page

const SignUpContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #eff0f3;
  padding: 20px;
  box-sizing: border-box;
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Logo = styled.img`
  width: 150px;
  height: 150px;
  margin-right: 10px;
`;

const Form = styled.form`
  max-width: 430px;
  width: 100%;
  background-color: #fff;
  padding: 24px;
  box-sizing: border-box;
  border-radius: 12px;
  box-shadow: 0 4px 6px var(--box-shadow-color);
`;

const FieldContainer = styled.div`
  margin-bottom: 16px;
  label {
    display: block;
    font-size: 15px;
    font-weight: 600;
    color: var(--secondary-color);
    margin-bottom: 8px;
  }
`;

const Header = styled.h1`
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #0d0d0d;
  text-align: center;
`;

const Tagline = styled.h2`
  margin: 6px 0 24px;
  font-size: 1.2rem;
  font-weight: 500;
  color: #929292;
  text-align: center;
`;

const LoginLink = styled.p`
  margin-top: 1rem;
  text-align: center;
  font-size: 15px;
  font-weight: 600;
  color: var(--secondary-color);
  a {
    color: var(--secondary-color);
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
`;

const Message = styled.p`
  color: ${(props) => (props.type === "error" ? "red" : "green")};
  text-align: left;
  font-size: 12px;
  margin-bottom: 2rem;
`;

// SignUp component: Manages form state, handles user sign-up, provides feedback messages while
// using context for user login and navigation for redirecting after successful registration
const SignUp = () => {
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { login } = useContext(LoggedInUserContext);
  const navigate = useNavigate();

  // Function to handle form submission, send user data to the server, handle success
  // and error responses,log in the user and redirect to the dashboard
  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("pending");
    setErrorMessage("");
    setSuccessMessage("");

    const formData = {
      username: event.target.username.value,
      email: event.target.email.value,
      password: event.target.password.value,
    };

    try {
      const response = await fetch("/newUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage(
          result.message || "Your account has been created successfully!"
        );
        await login(formData.email, formData.password);
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      } else {
        setErrorMessage(result.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setStatus("idle");
    }
  };

  // Render the sign-up page with a form for user registration,
  // error/success messages and a link to the login page
  return (
    <>
      <GlobalStyles />
      <SignUpContainer>
        <HeaderContainer>
          <Logo src="assets/blobbyMenu.png" alt="Logo" />
        </HeaderContainer>
        <Header>My restaurantTrackerApp</Header>
        <Tagline>Track and Save Your Favourite Places to Eat</Tagline>
        <Form onSubmit={handleSubmit}>
          {errorMessage && <Message type="error">{errorMessage}</Message>}
          {successMessage && <Message type="success">{successMessage}</Message>}
          <FieldContainer>
            <label htmlFor="username">Your username</label>
            <input type="text" id="username" name="username" required />
          </FieldContainer>
          <FieldContainer>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="Enter your email..."
            />
          </FieldContainer>
          <FieldContainer>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              placeholder="Enter your password..."
            />
          </FieldContainer>
          <button type="submit" disabled={status === "pending"}>
            Sign Up
          </button>
        </Form>
        <LoginLink>
          Already signed up? <Link to="/login">Go to log in</Link>
        </LoginLink>
      </SignUpContainer>
    </>
  );
};

export default SignUp;
