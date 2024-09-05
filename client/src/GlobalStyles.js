import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  :root {
    --primary-color: #ff8e3c;
    --primary-hover-color: #ff6c01;
    --secondary-color: #2a2a2a;
    --input-border-color: #c9d3db;
    --input-focus-border-color: #ff8e3c;
    --box-shadow-color: rgba(0, 0, 0, 0.1);
  }

  html, body {
    height: 100%;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  button {
    cursor: pointer;
    width: 100%;
    font-size: 18px;
    font-weight: 600;
    color: #fff;
    background-color: var(--primary-color);
    border: none;
    border-radius: 12px;
    padding: 10px;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: var(--primary-hover-color);
    }

    &:disabled {
      background-color: var(--primary-color);
      cursor: not-allowed;
    }
  }

  input {
    font-family: inherit;
    width: 100%;
    padding: 12px 16px;
    font-size: 15px;
    font-weight: 500;
    color: var(--secondary-color);
    background-color: #fff;
    border: 1px solid var(--input-border-color);
    border-radius: 12px;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: var(--input-focus-border-color);
    }
  }
`;

export default GlobalStyles;
