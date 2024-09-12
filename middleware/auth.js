const jwt = require('jsonwebtoken');

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) return res.status(401).send('Access Denied');

    try {
      const verified = jwt.verify(token, 'secret');
      req.user = verified;
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).send('Forbidden');
      }
      next();
    } catch (err) {
      res.status(400).send('Invalid Token');
    }
  };
};

module.exports = authMiddleware;
