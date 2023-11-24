const express = require("express");
const usersRouter = express.Router();
const { getUsers, getUsername } = require("../servers.controllers");

usersRouter.route("/").get(getUsers);

usersRouter.route("/:username").get(getUsername);

module.exports = usersRouter;
