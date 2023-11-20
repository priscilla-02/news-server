const db = require("./db/connection");

exports.getAllTopics = () => {
  let queryString = `SELECT * FROM topics`;
  return db.query(queryString).then(({ rows }) => {
    return rows;
  });
};
