import React, { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Divider,
  AppBar,
  Toolbar,
  Typography,
  Button,
  List,
  Container,
  Grid,
  Paper,
  Avatar,
  IconButton,
  TextField,
} from "@material-ui/core";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import SendIcon from "@material-ui/icons/Send";
import socket from "../socket/socket";

const Chat = () => {
  const [userid, setID] = React.useState("");
  const [Msg, setMsg] = React.useState("");
  const messageEl = useRef(null);
  const dispatch = useDispatch();
  const { user, users, chat, accessToken } = useSelector((state) => {
    return {
      user: state.user,
      users: state.users,
      chat: state.chat,
      accessToken: state.accessToken,
    };
  });

  useEffect(() => {
    if (messageEl) {
      messageEl.current.addEventListener("DOMNodeInserted", (event) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: "smooth" });
      });
    }
  }, []);

  React.useEffect(() => {
    const func = async () => {
      await getAllUsers();
    };
    func();
  }, []);

  const getAllReply = async (userId) => {
    let data = await fetch(
      "http://parking-finder-react.herokuapp.com/api/getMsg/" + userId,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => data)
      .catch((err) => console.log(err));
    setID(userId);
    dispatch({ type: "REPLY", payload: data });
    console.log(data);
  };

  React.useEffect(() => {
    socket.on("msg receive", async (data) => {
      console.log(data);
      await getAllReply(data);
    });
  }, []);
  const getAllUsers = async () => {
    let data = await fetch(
      "http://parking-finder-react.herokuapp.com/api/allusers",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => data)
      .catch((err) => console.log(err));
    dispatch({ type: "Users", payload: data });
  };
  const onSend = async () => {
    if (Msg !== "") {
      let data = await fetch("http://192.168.3.109:2000/api/newMsg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
        body: JSON.stringify({ ChatId: userid, msg: Msg }),
      })
        .then((res) => res.json())
        .then((data) => data)
        .catch((err) => console.log(err));
      dispatch({ type: "SENDMSG", payload: data });
      setMsg("");
      socket.emit("msg send", userid);
    }
  };
  console.log(users, users.length, chat);
  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={6} md={3}>
          <Paper
            style={{
              display: "flex",
              overflow: "auto",
              flexDirection: "column",
            }}
          >
            {users.length > 0
              ? users.map((data) => {
                  console.log(data);
                  return (
                    <>
                      <List
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "5%",
                        }}
                        key={data._id}
                      >
                        <Typography style={{ marginLeft: "4%" }} variant="h6">
                          {data.name}
                        </Typography>
                        <IconButton onClick={() => getAllReply(data._id)}>
                          <ChevronRightIcon />
                        </IconButton>
                      </List>
                      <Divider />
                    </>
                  );
                })
              : null}
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper
            style={{
              display: "flex",
              overflow: "auto",
              flexDirection: "column",
              minHeight: 500,
            }}
          >
            <div style={{ background: "#3f51b5" }}>
              <Toolbar>
                <Typography
                  variant="h6"
                  style={{ flexGrow: 1, color: "white" }}
                >
                  Name
                </Typography>
              </Toolbar>
            </div>
            <div
              style={{ height: "412px", overflowY: "scroll" }}
              ref={messageEl}
            >
              {chat.map((data) => {
                let timeAndDate = new Date(data.createdAt);
                return (
                  <div
                    style={{ marginTop: 40 }}
                    className={
                      data.email !== user.email ? "otherUser" : "currentUser"
                    }
                    key={data._id}
                  >
                    <p>
                      {data.msg}
                      <span style={{ display: "block" }}>
                        {`${timeAndDate.getHours()}:${timeAndDate.getMinutes()}  ${timeAndDate.getDate()}/${
                          timeAndDate.getMonth() + 1
                        }`}
                      </span>
                    </p>
                  </div>
                );
              })}
            </div>
            <div
              style={{
                display: "flex",
                padding: "20px 20px",
                background: "lightgray",
              }}
            >
              <TextField
                label="Type Your Massage ....."
                fullWidth
                value={Msg}
                onChange={(e) => setMsg(e.target.value)}
              />
              <IconButton onClick={() => onSend()}>
                <SendIcon />
              </IconButton>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Chat;
