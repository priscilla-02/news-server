const {
  getAllTopics,
  getObjByEndpoints,
  getCommentsByArticleId,
  getAllArticles,
  selectArticlebyId,
  checkIfArticleExists,
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

exports.getArticles = (req, res, next) => {
  getAllArticles()
    .then((article) => {
      res.status(200).send({ article });
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
