const mongodb = require("mongodb");

const { getDb } = require("../utils/database");

module.exports = class Post {
  static createPost(userId, text, filePath, createdAt) {
    const db = getDb();
    return db.collection("Posts").updateOne(
      { _id: new mongodb.ObjectId(userId) },
      {
        $push: {
          posts: {
            _id: new mongodb.ObjectId(),
            text: text,
            file: filePath,
            createdAt: createdAt,
          },
        },
      },
      { upsert: true }
    );
  }

  static addFriend(currentUserId, friendId) {
    const db = getDb();

    return db.collection("Friends").updateOne(
      {
        _id: new mongodb.ObjectId(currentUserId),
      },
      { $addToSet: { friends: friendId } },
      { upsert: true }
    );
  }

  static removeFriend(currentUserId, friendId) {
    const db = getDb();

    return db.collection("Friends").updateOne(
      {
        _id: new mongodb.ObjectId(currentUserId),
      },
      { $pull: { friends: friendId } }
    );
  }

  static getFriends(currentUserId) {
    const db = getDb();

    return db.collection('Friends').aggregate([
      { $match: { _id: new mongodb.ObjectId(currentUserId) } },
      { $unwind: '$friends' },
      {
        $project: {
          friend: { $convert: { input: "$friends", to: "objectId" } },
        },
      },
      {
        $lookup: {
          from: "Users",
          localField: "friend",
          foreignField: "_id",
          as: "friendDetails",
        },
      },
      { $unwind: '$friendDetails' },
      { $project: { friendId: '$friend', friendUsername: '$friendDetails.username', _id: 0 } }
    ]).toArray();
  }

  static getPosts() {
    const db = getDb();

    //query to fetch all posts in Posts collection

    return db
      .collection("Posts")
      .aggregate([
        {
          $lookup: {
            from: "Users",
            localField: "_id",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        { $unwind: "$userDetails" },
        {
          $addFields: {
            "posts.username": "$userDetails.username",
            "posts.userId": {
              $convert: { input: "$userDetails._id", to: "string" },
            },
          },
        },
        { $project: { posts: 1, _id: 0 } },
        { $group: { _id: 0, posts: { $push: "$posts" } } },
        {
          $project: {
            _id: 0,
            posts: {
              $reduce: {
                input: "$posts",
                initialValue: [],
                in: { $concatArrays: ["$$value", "$$this"] },
              },
            },
          },
        },
      ])
      .toArray();

    //query to fetch only our posts and our friend's posts

    // return db
    //   .collection("Friends")
    //   .aggregate([
    //     { $match: { _id: new mongodb.ObjectId(userId) } },
    //     { $addFields: { friends: { $concatArrays: ["$friends", ["$_id"]] } } },
    //     { $unwind: "$friends" },
    //     {
    //       $project: {
    //         id: { $convert: { input: "$friends", to: "objectId" } },
    //         _id: 0,
    //       },
    //     },
    //     {
    //       $lookup: {
    //         from: "Users",
    //         localField: "id",
    //         foreignField: "_id",
    //         as: "userDetails",
    //       },
    //     },
    //     { $unwind: "$userDetails" },
    //     { $project: { id: 1, username: "$userDetails.username" } },
    //     {
    //       $lookup: {
    //         from: "Posts",
    //         localField: "id",
    //         foreignField: "_id",
    //         as: "posts",
    //       },
    //     },
    //     { $project: { posts: "$posts.posts", username: 1, id: 1 } },
    //     { $unwind: "$posts" },
    //     {
    //       $addFields: { "posts.username": "$username", "posts.userId": "$id" },
    //     },
    //     { $group: { _id: 0, posts: { $push: "$posts" } } },
    //     {
    //       $project: {
    //         _id: 0,
    //         posts: {
    //           $reduce: {
    //             input: "$posts",
    //             initialValue: [],
    //             in: { $concatArrays: ["$$value", "$$this"] },
    //           },
    //         },
    //       },
    //     },
    //   ])
    //   .toArray();
  }
};
