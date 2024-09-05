import ReactDOM from "react-dom/client";
import App from "./App";
import LoggedInUserProvider from "./contexts/LoggedInUserContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <LoggedInUserProvider>
    <App />
  </LoggedInUserProvider>
);
