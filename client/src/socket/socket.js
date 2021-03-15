import React from "react";
import io from "socket.io-client";

const socket = io(
  "http://app-d83895ee-04a8-4417-b70b-0873e8873a83.cleverapps.io/"
);

export default socket;
