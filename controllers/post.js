const Post = require("../models/Post");

exports.createPost = (req, res, next) => {
  const filePath = req.file?.path.replace("\\", "/");
  const { userId, createdAt, text } = req.body;

  Post.createPost(userId, text, filePath, createdAt)
    .then(() => res.status(201).json({ message: "Created!" }))
    .catch((err) => next(err));
};

exports.getPosts = (req, res, next) => {
  Post.getPosts()
    .then((result) => {
      res.status(200).json(result[0]);
    })
    .catch((err) => next(err));
};

exports.addRemoveFriend = (req, res, next) => {
  const { currentUserId, friendId } = req.body;


  if (req.query.add === 'true') {
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
