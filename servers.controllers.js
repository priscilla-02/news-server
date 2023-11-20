const { getAllTopics, getObjByEndpoints } = require("./servers.models");

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
