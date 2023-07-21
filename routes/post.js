const express = require('express');

const isAuth = require('../middleware/is-auth');
const postControllers = require('../controllers/post');

const router = express.Router();

router.post('/create-post', isAuth, postControllers.createPost);

router.get('/posts', isAuth, postControllers.getPosts);

router.get('/posts/:userId', isAuth, postControllers.getPostsOfUser);

router.post('/friend', isAuth, postControllers.addRemoveFriend);

router.get('/friends', isAuth, postControllers.getFriends);

router.get('/like-post/:postId', isAuth, postControllers.likePost);

router.get('/unlike-post/:postId', isAuth, postControllers.unlikePost);

router.get('/liked-users/:postId', isAuth, postControllers.getPostStats);

router.post('/comment/:postId', isAuth, postControllers.addComment);

router.get('/comments/:postId', isAuth, postControllers.getComments);

router.post('/search', isAuth, postControllers.searchQuery);

module.exports = router;