const express = require('express');

const isAuth = require('../middleware/is-auth');
const postControllers = require('../controllers/post');

const router = express.Router();

router.post('/create-post', isAuth, postControllers.createPost);

module.exports = router;