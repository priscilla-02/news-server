const db = require("./db/connection");
const fs = require("fs/promises");
const endpoints = require("./endpoints.json");

exports.getAllTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

exports.getDocsByEndpoints = () => {
  return fs.readFile("./endpoints.json").then((endpoints) => {
    const objectEndpoints = JSON.parse(endpoints);
    return objectEndpoints;
  });
};
