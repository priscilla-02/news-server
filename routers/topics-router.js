const express = require("express");
const topicsRouter = express.Router();
const { getTopics } = require("../servers.controllers");

topicsRouter.route("/").get(getTopics);

module.exports = topicsRouter;
