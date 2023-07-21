const Post = require("../models/Post");

exports.createPost = (req, res, next) => {
  const filePath = req.files.file?.at(0).path.replace("\\", "/");
  const { userId, text } = req.body;

  Post.createPost(userId, text, filePath)
    .then(() => res.status(201).json({ message: "Created!" }))
    .catch((err) => next(err));
};

exports.getPosts = (req, res, next) => {
  Post.getPosts()
    .then((result) => {
      // console.log(result[0]);
      res.status(200).json(result[0]);
    })
    .catch((err) => next(err));
};

exports.getPostsOfUser = (req, res, next) => {
  Post.getPostsOfUser(req.params.userId)
    .then((result) => res.status(200).json(result[0]))
    .catch((err) => next(err));
};

exports.addRemoveFriend = (req, res, next) => {
  const { currentUserId, friendId } = req.body;

  if (req.query.add === "true") {
    Post.addFriend(currentUserId, friendId)
      .then(() => {
        Post.addFriend(friendId, currentUserId);
      })
      .then(() => {
        res.status(200).json({ message: "Friend added" });
      })
      .catch((err) => next(err));
  } else {
    Post.removeFriend(currentUserId, friendId)
      .then(() => {
        Post.removeFriend(friendId, currentUserId);
      })
      .then(() => {
        res.status(200).json({ message: "Friend removed" });
      })
      .catch((err) => next(err));
  }
};

exports.getFriends = (req, res, next) => {
  Post.getFriends(req.user._id)
    .then((result) => res.status(200).json({ friends: result }))
    .catch((err) => next(err));
};

exports.likePost = (req, res, next) => {
  Post.likePost(req.params.postId, req.user._id)
    .then(() => res.status(200).json({ message: "Liked the post!" }))
    .catch((err) => next(err));
};

exports.unlikePost = (req, res, next) => {
  Post.unlikePost(req.params.postId, req.user._id)
    .then(() => res.status(200).json({ message: "Unliked the post!" }))
    .catch((err) => next(err));
};

exports.getPostStats = (req, res, next) => {
  Post.getPostStats(req.params.postId)
    .then((result) =>
      res.status(200).json({
        users: result?.users || [],
        totalLikes: result?.totalLikes || 0,
        totalComments: result?.totalComments || 0,
      })
    )
    .catch((err) => next(err));
};

exports.addComment = (req, res, next) => {
  Post.addComment(req.params.postId, req.body, req.user._id)
    .then(() => res.status(200).json({ message: "Comment Added!" }))
    .catch((err) => next(err));
};

exports.getComments = (req, res, next) => {
  Post.getComments(req.params.postId)
    .then((result) => res.status(200).json({ comments: result }))
    .catch((err) => next(err));
};

exports.searchQuery = (req, res, next) => {
  Post.searchQuery(req.body.searchText)
    .then((result) => res.status(200).json(result[0] || {}))
    .catch((err) => next(err));
};
