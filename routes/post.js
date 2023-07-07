const express = require('express');

const isAuth = require('../middleware/is-auth');
const postControllers = require('../controllers/post');

const router = express.Router();

router.post('/create-post', isAuth, postControllers.createPost);

router.get('/posts', isAuth, postControllers.getPosts);

router.post('/friend', isAuth, postControllers.addRemoveFriend);

router.get('/friends', isAuth, postControllers.getFriends);

module.exports = router;