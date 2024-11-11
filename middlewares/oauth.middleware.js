const JWT = require('jsonwebtoken');
const DotEnv = require('dotenv');
DotEnv.config();

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    console.log('verifyToken authHeader', authHeader);
    const token = authHeader && authHeader.split(' ')[1];
    console.log('Token', token);
    if (!token) return res.sendStatus(401);

    console.log(' reached next()');
    req.token = token;
    next();
  } catch (error) {
    return res.status(500).send({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

module.exports = { verifyToken };
