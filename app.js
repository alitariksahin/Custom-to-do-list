const express = require("express");
const bodyParser = require("body-parser");

const router = require("./routes/index");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use("", router);


app.listen(process.env.PORT || 3000, function() {
  console.log("server started");
})
