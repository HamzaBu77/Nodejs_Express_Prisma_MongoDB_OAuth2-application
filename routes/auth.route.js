const Express = require('express');
const Controller = require('../controllers/auth.controller.js');
const VerifyToken = require('../middlewares/oauth.middleware.js');

const router = Express.Router();

router.post('/signup', Controller.signUp);
router.post('/login', Controller.login);
// router.post('/token');

router.post('/token', VerifyToken.verifyToken, Controller.userDetails);

module.exports = router;
