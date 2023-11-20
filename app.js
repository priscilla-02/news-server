const express = require("express");
const app = express();
const { getTopics } = require("./servers.controllers");

app.use(express.json());

app.get("/api/topics", getTopics);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad request" });
  } else if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    res.status(500).send({ msg: "internal server error" });
  }
});

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Not Found" });
});
module.exports = app;
