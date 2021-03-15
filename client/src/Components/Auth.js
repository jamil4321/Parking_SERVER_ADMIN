import React from "react";
import { Button } from "@material-ui/core";

const Auth = (props) => {
  console.log();

  const submitActivation = async () => {
    let token = props.match.params.id;
    let data = await fetch(
      "http://app-d83895ee-04a8-4417-b70b-0873e8873a83.cleverapps.io/api/email-activate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      }
    )
      .then((res) => res.json())
      .then((data) => data)
      .catch((err) => console.log(err));

    alert(data.message);
  };
  return (
    <div className="App">
      <h1>Welocome to Parking Finder App </h1>
      <h2>1 Step More Just Click This Button</h2>
      <Button variant="contained" color="primary" onClick={submitActivation}>
        Click Me
      </Button>
    </div>
  );
};

export default Auth;
