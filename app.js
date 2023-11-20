const express = require("express");
const app = express();
const { getTopics, getByEndpoints } = require("./servers.controllers");

app.get("/api/topics", getTopics);

app.get("/api", getByEndpoints);

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    res.status(500).send({ msg: "internal server error" });
  }
});

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Not Found" });
});
module.exports = app;
