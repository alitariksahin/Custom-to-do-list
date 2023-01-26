const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const router = require("./routes/index");

const app = express();

mongoose.set("strictQuery", false);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use("", router);

const start = async function() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    app.listen(process.env.PORT || 3000, function() {
      console.log("server started");
    });
  }catch(err) {
    console.log(err);
  }
}
start();
