import React from "react";
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
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Modal from "@material-ui/core/Modal";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import socketCon from "../socket/socket";

import { useDispatch, useSelector } from "react-redux";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
  },
  fab: {
    position: "fixed",
    bottom: theme.spacing(2),
    left: theme.spacing(2),
  },
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  paperView: {
    position: "absolute",
    width: "100vw",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const AddLaneAndParking = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [modalStyle] = React.useState(getModalStyle);
  const [openView, setOpenView] = React.useState(false);
  const [laneName, setLaneName] = React.useState("");
  const [parkingArea, setParkingArea] = React.useState(0);
  const [laneID, setLaneID] = React.useState("");
  const dispatch = useDispatch();
  const { accessToken, lane, parkingSpace } = useSelector((state) => {
    return {
      accessToken: state.accessToken,
      lane: state.lane,
      parkingSpace: state.parkingSpace,
    };
  });

  const getAllLane = async () => {
    let data = await fetch(
      "http://parking-finder-react.herokuapp.com/api/getLane",
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
    dispatch({ type: "GETLANE", payload: data });
  };
  React.useEffect(() => getAllLane(), []);
  const handleOpen = () => {
    setOpen(true);
  };
  React.useEffect(() => {
    socketCon.on("parking Update", (data) => {
      console.log("Booked", data);
      getPArkingViewData(data);
    });
  }, []);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpenView = () => {
    setOpenView(true);
  };

  const handleCloseView = () => {
    setOpenView(false);
  };

  const getPArkingViewData = async (laneId) => {
    let data = await fetch(
      "http://parking-finder-react.herokuapp.com/api/getParking",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
        body: JSON.stringify({ laneId }),
      }
    )
      .then((res) => res.json())
      .then((data) => data)
      .catch((err) => console.log(err));

    dispatch({ type: "VIEWPARKINGSPACE", payload: data });

    handleOpenView();
  };
  const onSubmitForm = async (e) => {
    e.preventDefault();
    if ((laneName !== "", parkingArea > 0)) {
      let body = { laneName, parkingArea };
      let data = await fetch(
        "http://parking-finder-react.herokuapp.com/api/addLane",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
          },
          body: JSON.stringify(body),
        }
      )
        .then((res) => res.json())
        .then((data) => data)
        .catch((err) => console.log(err));
      socketCon.emit("newlane", data);
      dispatch({ type: "ADDLANE", payload: data });
      handleClose();
    }
  };
  const deleteLane = async (id) => {
    let data = await fetch(
      "http://parking-finder-react.herokuapp.com/api/removeLane",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
        body: JSON.stringify({ laneId: id }),
      }
    )
      .then((res) => res.json())
      .then((data) => data)
      .catch((err) => console.log(err));
    console.log(await data);
    dispatch({ type: "LANEREMOVE", payload: id });
    socketCon.emit("delete lane");
  };
  const body = (
    <div style={modalStyle} className={classes.paper}>
      <Grid container>
        <Grid item>
          <form
            className={classes.form}
            noValidate
            onSubmit={(e) => onSubmitForm(e)}
          >
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="LaneName"
              label="Lane Name"
              name="LaneName"
              value={laneName}
              onChange={(e) => setLaneName(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="Parking Area"
              label="How Many Parking Area?"
              type="number"
              value={parkingArea}
              onChange={(e) => setParkingArea(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Save
            </Button>
          </form>
        </Grid>
      </Grid>
    </div>
  );

  console.log(lane, parkingSpace);
  return (
    <div className={classes.root}>
      <Fab
        color="primary"
        aria-label="add"
        classsName={classes.fab}
        onClick={handleOpen}
      >
        <AddIcon />
      </Fab>
      <Container>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Sr No.</TableCell>
                <TableCell align="left">Lane Name</TableCell>
                <TableCell align="right">Parking Areas</TableCell>
                <TableCell align="center">Action button</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lane.length > 0
                ? lane.map((data, i) => (
                    <TableRow key={data.id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell component="th" scope="row">
                        {data.name}
                      </TableCell>
                      <TableCell align="right">
                        {data.totalPakringSpace}
                      </TableCell>
                      <TableCell align="left">
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-evenly",
                          }}
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => getPArkingViewData(data.id)}
                          >
                            View
                          </Button>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => deleteLane(data.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        </TableContainer>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          {body}
        </Modal>
        <Dialog
          fullScreen
          open={openView}
          onClose={handleCloseView}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleCloseView}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                Parking View
              </Typography>
            </Toolbar>
          </AppBar>
          <div style={{ marginTop: 80 }}>
            <Grid container>
              {parkingSpace.length > 0
                ? parkingSpace.map((data) => {
                    let time = new Date();
                    let endTime = new Date(data.endTime);
                    let backgroundColor = "orange";
                    console.log(
                      "Data",
                      time > endTime,
                      data.name,
                      time,
                      endTime
                    );
                    if (time < endTime && data.isBooked === true)
                      backgroundColor = "red";
                    return (
                      <Grid item xs={3}>
                        <Paper
                          style={{
                            margin: 20,
                            padding: 20,
                            textAlign: "center",
                            backgroundColor: backgroundColor,
                          }}
                          elevation={3}
                        >
                          <h1>{data.name}</h1>
                        </Paper>
                      </Grid>
                    );
                  })
                : null}
            </Grid>
          </div>
        </Dialog>
      </Container>
    </div>
  );
};

export default AddLaneAndParking;
