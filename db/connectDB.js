const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb://uzwz23aawvqyop23efq8:UXZFnz7RyQTewTEVBo63@brselkfgq5rffvw-mongodb.services.clever-cloud.com:27017/brselkfgq5rffvw",
    {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }
  )
  .then(() => console.log("DB Connect established"))
  .catch((err) => console.log("DB Conection error: ", err));
