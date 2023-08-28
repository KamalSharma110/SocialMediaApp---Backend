const mongodb = require("mongodb");

const Post = require("../models/Post");
const User = require("../models/User");
const { getIO, getUsers } = require("../utils/socketio");

exports.createPost = (req, res, next) => {
  const imagePath = req.files.image?.at(0).path.replace("\\", "/");
  const { userId, text } = req.body;
  const postId = new mongodb.ObjectId();

  Post.createPost(postId, userId, text, imagePath)
    .then(() => {
      const io = getIO();
      io.emit("post_added");
      res.status(201).json({ message: "Created!" });
    })
    .catch((err) => next(err));
};

exports.getPosts = (req, res, next) => {
  Post.getPosts()
    .then((result) => {
      result[0].posts.sort((a, b) => b.createdAt - a.createdAt);
      res.status(200).json(result[0]);
    })
    .catch((err) => next(err));
};

exports.getPostsOfUser = (req, res, next) => {
  Post.getPostsOfUser(req.params.userId)
    .then((result) => {
      result[0].posts.sort((a, b) => b.createdAt - a.createdAt);
      res.status(200).json(result[0])
    })
    .catch((err) => next(err));
};

exports.addRemoveFriend = async (req, res, next) => {
  const { currentUserId, friendId } = req.body;
  const io = getIO();
  const users = getUsers();

  if (req.query.add === "true") {
    try {
      let result;
      await Post.addFriend(currentUserId, friendId);
      await Post.addFriend(friendId, currentUserId);
      result = await User.getProfile(friendId);
      io.to(users[currentUserId]).emit("add_friend", {
        username: result.username,
        profileImage: result.profileImage,
        id: friendId,
      });
      result = await User.getProfile(currentUserId);
      io.to(users[friendId]).emit("add_friend", {
        username: result.username,
        profileImage: result.profileImage,
        id: currentUserId,
      });
      res.status(200).json({ message: "Friend added" });
    } catch (err) {
      next(err);
    }
  } else {
    Post.removeFriend(currentUserId, friendId)
      .then(() => {
        Post.removeFriend(friendId, currentUserId);
      })
      .then(() => {
        io.to(users[currentUserId]).emit("remove_friend", { id: friendId });
        io.to(users[friendId]).emit("remove_friend", { id: currentUserId });

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
        likeUsers: result?.likeUsers || [],
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
