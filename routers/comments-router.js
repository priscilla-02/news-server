const express = require("express");
const commentsRouter = express.Router();
const { patchCommentVotes, deleteComments } = require("../servers.controllers");

commentsRouter
  .route("/:comment_id")
  .patch(patchCommentVotes)
  .delete(deleteComments);

module.exports = commentsRouter;
