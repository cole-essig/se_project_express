const jwt = require('jsonwebtoken');
const { unauthorizedError } = require('../utils/errors');
const JWT_SECRET = require("../utils/config");

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(unauthorizedError).send({message: 'Authorization required'})
  }
  const token = authorization.replace('Bearer ', "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    console.error(err);
    return res.status(unauthorizedError).send({ message: "Authorization required"})
  }
}

module.exports = { auth };