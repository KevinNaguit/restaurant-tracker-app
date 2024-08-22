import {
  BrowserRouter as Router,
  Routes as Switch,
  Route,
} from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" element={<h1>Welcome to My React App</h1>} />
        <Route path="/*" element={<h1>Page Not Found</h1>} />
      </Switch>
    </Router>
  );
};

export default App;
