import {
  BrowserRouter as Router,
  Routes as Switch,
  Route,
} from "react-router-dom";
import GlobalStyles from "./GlobalStyles.js";
import SignUp from "./pages/SignUp.js";
import Login from "./pages/Login.js/index.js";
import Dashboard from "./pages/Dashboard.js/index.js";

const App = () => {
  return (
    <>
      <GlobalStyles />
      <Router>
        <Switch>
          <Route path="/" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/*" element={<h1>Page Not Found</h1>} />
        </Switch>
      </Router>
    </>
  );
};

export default App;
