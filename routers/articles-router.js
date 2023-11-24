const express = require("express");
const articlesRouter = express.Router();

const {
  getArticles,
  getByArticleId,
  patchArticle,
  getComments,
  postComments,
} = require("../servers.controllers");

articlesRouter.route("/").get(getArticles);

articlesRouter.route("/:article_id").get(getByArticleId).patch(patchArticle);

articlesRouter
  .route("/:article_id/comments")
  .get(getComments)
  .post(postComments);

module.exports = articlesRouter;
