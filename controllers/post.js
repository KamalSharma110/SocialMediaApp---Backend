const Post = require("../models/Post");

exports.createPost = (req, res, next) => {
  const filePath = req.file?.path.replace("\\", "/");

  Post.createPost({
    userId: req.body.userId,
    text: req.body.text,
    file: filePath,
  })
    .then(() => res.status(201).json({message: 'Created!'}))
    .catch((err) => next(err));
};
