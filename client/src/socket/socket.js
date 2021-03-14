import React from "react";
import io from "socket.io-client";

const socket = io("http://parking-finder-react.herokuapp.com/");

export default socket;
