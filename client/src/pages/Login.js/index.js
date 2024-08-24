import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import GlobalStyles from "../../GlobalStyles";

// Styled components
const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const Form = styled.form`
  max-width: 330px;
  padding: 1rem;
  width: 100%;
`;

const FloatingLabel = styled.div`
  &:focus-within {
    z-index: 2;
  }
`;

const EmailInput = styled.input.attrs({
  type: "email",
})`
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
`;

const PasswordInput = styled.input.attrs({
  type: "password",
})`
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
`;

const AppName = styled.h1`
  margin: 0;
  font-size: 2rem;
`;

const Slogan = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  color: #666;
`;

const SignUpLink = styled.p`
  margin-top: 1rem;
  a {
    color: #007bff;
    text-decoration: none;
    font-weight: bold;
  }
  a:hover {
    text-decoration: underline;
  }
`;

// Login component and state variables for managing user input and login status
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // If login is successful, update success state and navigate to dashboard
        setSuccess(true);
        setError(null);
        navigate("/dashboard");
      } else {
        setError(data.message || "An error occurred");
      }
    } catch (error) {
      setError("An error occurred");
    }
  };

  // Rendering the login component with global styles, conditional error and success messages,
  // a login form for email and password inputs and a link to the sign-up page
  return (
    <>
      <GlobalStyles />
      <LoginContainer>
        <AppName>Welcome back!</AppName>
        <Slogan>Already created an account? Sign in here.</Slogan>
        <Form onSubmit={handleSubmit} className="form-signin">
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success ? (
            <p style={{ color: "green" }}>Login successful! Redirecting...</p>
          ) : (
            <>
              <FloatingLabel>
                <label htmlFor="email">Enter email:</label>
                <EmailInput
                  id="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </FloatingLabel>
              <FloatingLabel>
                <label htmlFor="password">Enter password:</label>
                <PasswordInput
                  id="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </FloatingLabel>
              <button type="submit">Login</button>
            </>
          )}
        </Form>
        <SignUpLink>
          Don't have an account? <Link to="/">Sign up</Link>
        </SignUpLink>
      </LoginContainer>
    </>
  );
};

export default Login;
