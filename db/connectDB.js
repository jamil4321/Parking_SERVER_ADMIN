const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://admin:admin@myfisrtlerningapp.zbcua.mongodb.net/parking?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }
  )
  .then(() => console.log("DB Connect established"))
  .catch((err) => console.log("DB Conection error: ", err));
