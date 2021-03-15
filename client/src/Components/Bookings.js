import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Grid,
  TextField,
  FormControlLabel,
  Button,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import socket from "../socket/socket";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
  },
  fab: {
    position: "fixed",
    bottom: theme.spacing(2),
    left: theme.spacing(2),
  },
}));

const Bookings = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { bookings, accessToken } = useSelector((state) => {
    return {
      bookings: state.bookings,
      accessToken: state.accessToken,
    };
  });
  const distpatch = useDispatch();
  const getAllBookings = async () => {
    let data = await fetch(
      "http://app-d83895ee-04a8-4417-b70b-0873e8873a83.cleverapps.io/api/allBookings",
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
    distpatch({ type: "BOOKINGS", payload: data });
  };
  React.useEffect(() => getAllBookings(), []);
  console.log(bookings);
  const formatAMPM = (date) => {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  };
  const onCancelOrder = async (id) => {
    let data = await fetch(
      "http://app-d83895ee-04a8-4417-b70b-0873e8873a83.cleverapps.io/api/cencelBooking",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
        body: JSON.stringify({ id }),
      }
    )
      .then((res) => res.json())
      .then((data) => data)
      .catch((err) => console.log(err));
    console.log(data);
    socket.emit("Cancel Booking");
    dispatch({ type: "CANCELORDER", payload: id });
  };
  return (
    <Container>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Sr No.</TableCell>
              <TableCell align="left">Booking ID</TableCell>
              <TableCell align="left">Booked By</TableCell>
              <TableCell align="left">Space Name</TableCell>
              <TableCell align="left">Booking Start Time</TableCell>
              <TableCell align="left">Booking End Time</TableCell>
              <TableCell align="left">Booking Status</TableCell>
              <TableCell align="left">Action Button</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.length > 0
              ? bookings.map((data, i) => {
                  let currentTime = new Date();
                  let startTime = new Date(data.startTime);
                  let endTime = new Date(data.endTime);
                  let disableButton = false;
                  let status = "Booked";
                  if (!data.isBooking) {
                    status = "Canceled";
                    disableButton = true;
                  } else if (currentTime < startTime) {
                    status = "Pending";
                  } else if (data.isBooking && currentTime > startTime) {
                    status = "Arived";
                    disableButton = true;
                  } else if (data.isBooking && currentTime > endTime) {
                    status = "Done";
                    disableButton = true;
                  }

                  if (currentTime > startTime) {
                    if (data.isBooking) {
                      disableButton = true;
                    }
                  }
                  console.log(data.isBooking);
                  return (
                    <TableRow key={data.id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell component="th" scope="row">
                        {data.id}
                      </TableCell>
                      <TableCell align="right">{data.email}</TableCell>
                      <TableCell align="left">{data.parkingSpace}</TableCell>
                      <TableCell align="left">
                        {`${formatAMPM(startTime)}  ${startTime.getDate()}-${
                          startTime.getMonth() + 1
                        }-${startTime.getFullYear()}`}
                      </TableCell>
                      <TableCell align="left">{`${formatAMPM(
                        endTime
                      )}  ${endTime.getDate()}-${
                        endTime.getMonth() + 1
                      }-${endTime.getFullYear()}`}</TableCell>
                      <TableCell align="right">{status}</TableCell>
                      <TableCell align="left">
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => onCancelOrder(data.id)}
                          disabled={disableButton}
                        >
                          Cancel
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              : null}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Bookings;
