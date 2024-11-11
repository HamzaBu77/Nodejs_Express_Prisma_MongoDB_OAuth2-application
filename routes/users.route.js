const Express = require('express');
const Controller = require('../controllers/users.controller.js');

const router = Express.Router();

router.post('/signup', Controller.signUp);

module.exports = router;
