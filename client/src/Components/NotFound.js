import React from "react";
import { Container, Grid, Typography } from "@material-ui/core";

const NotFound = () => {
  return (
    <Container component="main" maxWidth="xs">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography component="h1" variant="h5">
            Page Not Found
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NotFound;
