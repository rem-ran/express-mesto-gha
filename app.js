const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bobyParse = require("body-parse");
const routes = require("./routes");

const { PORT = 3000 } = process.env;

// mongoose.connect("mongodb://localhost:27017/mydb", {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useFindAndModify: false,
// });

const app = express();

app.use(bobyParse);

app.get("/", (req, res) => {
  res.send("hello, i'm changed. again");
});

app.listen(PORT, () => {
  console.log("hello");
});
