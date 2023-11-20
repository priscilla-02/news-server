const db = require("./db/connection");

exports.getAllTopics = () => {
  let queryString = `SELECT topics.* FROM topics`;
  return db.query(queryString).then(({ rows }) => {
    return rows;
  });
};
