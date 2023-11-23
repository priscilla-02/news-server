const db = require("./db/connection");
const fs = require("fs/promises");

exports.getAllTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

exports.getObjByEndpoints = () => {
  return fs.readFile("./endpoints.json").then((endpoints) => {
    const objEndpoints = JSON.parse(endpoints);
    return objEndpoints;
  });
};

exports.selectArticlebyId = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((result) => {
      const article = result.rows[0];
      if (!article) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }

      return article;
    });
};

exports.getAllArticles = () => {
  return db
    .query(
      `
      SELECT articles.article_id, articles.title, articles.body, articles.votes,
             articles.topic, articles.author, articles.created_at, 
             articles.article_img_url,
             COUNT(comments.comment_id) AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      GROUP BY articles.article_id
      ORDER BY articles.created_at DESC;
    `
    )
    .then((result) => {
      return result.rows;
    });
};

exports.checkIfArticleExists = (article_id) => {
  return db
    .query(
      `
  SELECT * FROM articles
  WHERE article_id = $1
`,
      [article_id]
    )
    .then((result) => {
      const returnComments = result.rows;
      if (!returnComments.length) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return returnComments;
    });
};

exports.getCommentsByArticleId = (article_id) => {
  return db
    .query(
      `
    SELECT * FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;
  `,
      [article_id]
    )
    .then((result) => {
      const returnComments = result.rows;
      return returnComments;
    });
};

exports.updateVote = (article_id, inc_votes) => {
  if (!inc_votes) {
    return Promise.reject({ status: 400, msg: "Invalid inc_votes" });
  }
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Article Not Found" });
      }
      return rows[0];
    });
};

exports.insertNewComments = (username, body, article_id) => {
  if ((!username && body) || (username && !body)) {
    return Promise.reject({
      status: 400,
      msg: "Missing username or body",
    });
  }
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 400,
          msg: "This user does not exist",
        });
      }
      return db
        .query(
          `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;`,
          [username, body, article_id]
        )
        .then(({ rows }) => {
          return rows[0];
        });
    });
};

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => {
    return rows;
  });
};
