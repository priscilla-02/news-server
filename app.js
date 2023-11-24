const express = require("express");
const app = express();
const apiRouter = require("./routers/api-router");

const {
  getTopics,
  getByEndpoints,
  getByArticleId,
  getArticles,
  getComments,
  patchArticle,
  postComments,
  getUsers,
  deleteComments,
  getUsername,
  patchCommentVotes,
} = require("./servers.controllers");

app.use(express.json());

app.use("/api", apiRouter);

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    console.log("err", err);
    res.status(500).send({ msg: "internal server error" });
  }
});
app.all("*", (req, res) => {
  res.status(404).send({ msg: "Not Found" });
});
module.exports = app;
