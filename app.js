const express = require("express");
const app = express();
const {
  getTopics,
  getByEndpoints,
  getByArticleId,
  getArticles,
  getComments,
  postComments,
} = require("./servers.controllers");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getByEndpoints);

app.get("/api/articles/:article_id", getByArticleId);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getComments);

app.post("/api/articles/:article_id/comments", postComments);

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
