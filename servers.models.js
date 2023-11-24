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
    .query(
      `
    SELECT articles.*, COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`,
      [article_id]
    )
    .then((result) => {
      const article = result.rows[0];
      if (!article) {
        return Promise.reject({ status: 404, msg: "Article Not Found" });
      }

      return article;
    });
};

exports.getAllArticles = (topic, sort_by, order) => {
  const validSortby = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];
  const validOrder = ["asc", "desc", "DESC", "ASC"];

  if (sort_by && !validSortby.includes(sort_by)) {
    return Promise.reject({
      status: 400,
      msg: `This is not a valid sort_by query`,
    });
  }
  if (order && !validOrder.includes(order)) {
    return Promise.reject({
      status: 400,
      msg: `This is not a valid order query`,
    });
  }

  let queryValues = [];
  let queryString = `SELECT articles.article_id, articles.title, articles.body, articles.votes, articles.topic, articles.author, articles.created_at,
               article_img_url,
               COUNT(comment_id) AS comment_count
               FROM articles
               LEFT JOIN comments
               ON articles.article_id = comments.article_id `;

  if (topic) {
    queryString += `WHERE articles.topic = $1 `;
    queryValues.push(topic);
  }

  queryString += `GROUP BY articles.article_id `;

  if (sort_by && order) {
    queryString += `ORDER BY ${sort_by} ${order}, created_at ${order} `;
  } else if (sort_by) {
    queryString += `ORDER BY ${sort_by} ASC `;
  } else {
    queryString += `ORDER BY created_at DESC `;
  }

  return db.query(queryString, queryValues).then(({ rows }) => {
    if (topic && !rows.length) {
      return Promise.reject({
        status: 404,
        msg: "No Article for this topic exist",
      });
    }
    return rows;
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

exports.removeComments = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [
      comment_id,
    ])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      }
    });
};

exports.checkIfTopicExists = (topic) => {
  return db
    .query(
      `SELECT * FROM topics
        WHERE slug = $1;`,
      [topic]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Topic Not Found" });
      }
    });
};
