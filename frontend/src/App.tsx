import React from "react";
import { AuthCheck } from "reactfire/auth";
import HomePage from "./Components/Home/home";
import LoginPage from "./Components/Login/Login";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ViewAll from "./Components/view_all/ViewAll";
function App() {
  return (
    <AuthCheck fallback={<LoginPage />}>
      <Router>
        <Switch>
          <Route path="/view_all" children={<ViewAll />} />
          <Route path="/" children={<HomePage />} />
        </Switch>
      </Router>
    </AuthCheck>
  );
}

export default App;
