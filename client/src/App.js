import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import GlobalStyles from "./GlobalStyles.js";

// Page components
import SignUp from "./pages/SignUp/index.js";
import LogIn from "./pages/LogIn/index.js";
import Dashboard from "./pages/Dashboard/index.js";
import Favourites from "./pages/Favourites/index.js";
import WantToTry from "./pages/WantToTry/index.js";
import Tags from "./pages/Tags/index.js";

const App = () => {
  return (
    <>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="favourites" element={<Favourites />} />
            <Route path="want-to-try" element={<WantToTry />} />
            <Route path="tags" element={<Tags />} />
          </Route>
          <Route path="/*" element={<h1>Page Not Found</h1>} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
