const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/Register", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`connection successful`);
  })
  .catch(() => {
    console.log(`no connection`);
  });
