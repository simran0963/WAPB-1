const express = require("express");
// const bodyParser = require("body-parser");
const app = express();
// app.use(bodyParser.json());
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");

app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://pewxh:M58qUsupX2v6kQF@wag-1.xrklo.mongodb.net/wag1?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("DB connected.");
  })
  .catch(() => {
    console.log("DB connection failed.");
  });

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  next();
});
app.use("/api/posts", postsRoutes);
module.exports = app;
