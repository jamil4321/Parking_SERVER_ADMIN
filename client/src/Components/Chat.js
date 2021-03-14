import React, { Component } from "react";
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


const FeedBack = () => {
    const { users, chat } = React.useSelector(state => {
        return {
            users: state.users,
            chat:state.chat
        }
    })
    const getAllData = async () => {
        let data = await fetch('http://127.0.0.1:2000/getChatdata')
    }
    return (
        
    )
}