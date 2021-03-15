import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SignIn from "./Components/SignIn";
import SignUp from "./Components/Signup";
import Auth from "./Components/Auth";
import NotFound from "./Components/NotFound";
import React from "react";
import Home from "./Components/Home";
import { useSelector } from "react-redux";
import socketCon from "./socket/socket";

function App() {
  const { user, accessToken } = useSelector((state) => {
    return {
      user: state.user,
      accessToken: state.accessToken,
    };
  });
  React.useEffect(() => {
    socketCon.emit("hello World");
    socketCon.on("hello", () => {
      console.log("hi!");
    });
  });
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={NotFound} />
        <Route exact path="/authentication/activate/:id" component={Auth} />
        <Route
          path="/admin/dashboard/home"
          component={!user || !user.name ? SignIn : Home}
        />
        <Route Path="/admin/dashboard/signup" component={SignUp} />
      </Switch>
    </Router>
  );
}

export default App;
