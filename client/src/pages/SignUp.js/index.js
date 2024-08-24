import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import GlobalStyles from "../../GlobalStyles";

// Styled components
const SignUpContainer = styled.div`
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

const LoginLink = styled.p`
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

// Component for the SignUp form with state management for user input and feedback messages
const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Function to handle form submission by sending data to the server and managing responses
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setError(null);
      } else {
        setError(data.message || "An error occurred");
      }
    } catch (error) {
      setError("An error occurred");
    }
  };

  // Rendering the SignUp form with global styles, user input fields and form submission handling
  return (
    <>
      <GlobalStyles />
      <SignUpContainer>
        <AppName>My App</AppName>
        <Slogan>Let's get started</Slogan>
        <Form onSubmit={handleSubmit} className="form-signin">
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success ? (
            <p style={{ color: "green" }}>Sign up successful! Please log in.</p>
          ) : (
            <>
              <FloatingLabel>
                <label htmlFor="username">Your username:</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  required
                />
              </FloatingLabel>
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
              <button type="submit">Continue</button>
            </>
          )}
        </Form>
        <LoginLink>
          Already have an account? <Link to="/login">Log in</Link>
        </LoginLink>
      </SignUpContainer>
    </>
  );
};

export default SignUp;
