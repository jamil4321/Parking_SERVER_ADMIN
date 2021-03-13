import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SignIn from "./Components/SignIn";
import SignUp from "./Components/Signup";
import Auth from "./Components/Auth";
import NotFound from "./Components/NotFound";
import React from "react";
import Home from "./Components/Home";
import { useSelector } from "react-redux";
import io from "socket.io-client";

function App() {
  const { user, accessToken } = useSelector((state) => {
    return {
      user: state.user,
      accessToken: state.accessToken,
    };
  });
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={NotFound} />
        <Route
          path="/admin/dashboard/home"
          component={!user || !user.name ? SignIn : Home}
        />
        <Route Path="/admin/dashboard/signup" component={SignUp} />
        <Route path="/authentication/activate/" component={Auth} />
      </Switch>
    </Router>
  );
}

export default App;