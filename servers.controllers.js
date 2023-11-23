const {
  getAllTopics,
  getObjByEndpoints,
  selectArticlebyId,
  getAllArticles,
  checkIfArticleExists,
  getCommentsByArticleId,

  updateVote,

  insertNewComments,

  selectUsers,

  removeComments,
  checkIfTopicExists,
  selectArticles,
} = require("./servers.models");

exports.getTopics = (req, res, next) => {
  getAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getByEndpoints = (req, res, next) => {
  getObjByEndpoints()
    .then((endpoints) => {
      res.status(200).send({ endpoints });
    })
    .catch(next);
};

exports.getByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  selectArticlebyId(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  const { topic } = req.query;
  if (!topic) {
    return getAllArticles().then((article) => {
      res.status(200).send({ article });
    });
  }
  checkIfTopicExists(topic)
    .then(() => {
      return getAllArticles(topic);
    })
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;

  checkIfArticleExists(article_id)
    .then(() => {
      return getCommentsByArticleId(article_id);
    })
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  updateVote(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.postComments = (req, res, next) => {
  const { username, body } = req.body;
  const { article_id } = req.params;

  checkIfArticleExists(article_id)
    .then(() => {
      return insertNewComments(username, body, article_id);
    })
    .then((updatedComments) => {
      res.status(201).send(updatedComments);
    })
    .catch(next);
};

exports.getUsers = (req, res, next) => {
  selectUsers().then((users) => {
    res.status(200).send({ users });
  });
};

exports.deleteComments = (req, res, next) => {
  const { comment_id } = req.params;
  removeComments(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.getArticlebyQuery = (req, res, next) => {
  console.log(req.query);
  const { topic } = req.query;
  console.log(topic);
  selectArticles(topic)
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch(next);
};
