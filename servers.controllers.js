const {
  getAllTopics,
  getObjByEndpoints,
  getAllArticles,
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

exports.getArticles = (req, res, next) => {
  getAllArticles()
    .then((article) => {
      res.status(200).send({ article });

    })
    .catch(next);
};
