const { getAllTopics } = require("./servers.models");

exports.getTopics = (req, res, next) => {
  getAllTopics()
    .then((result) => {
      res.status(200).send({ result });
    })
    .catch(next);
};
