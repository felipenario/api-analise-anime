let express = require('express');
let router = express.Router();
const auth = require('../lib/auth');

let controller = require('../controllers/login');

router.post('/signup', controller.signup)
router.post('/login', controller.login)
router.post('/logout', auth.jwtVerify, controller.logout)

module.exports = router;