import React from "react";
import { AuthCheck } from "reactfire/auth";
import HomePage from "./Components/Home/home";
import LoginPage from "./Components/Login/Login";
function App() {
  return (
    <AuthCheck fallback={<LoginPage />}>
      <HomePage />
    </AuthCheck>
  );
}

export default App;
