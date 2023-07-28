const mongodb = require("mongodb");
let _db;

const mongoConnect = (cb) => {
  mongodb.MongoClient.connect(
    "mongodb+srv://kamal2507s:Kamalsharma1$@cluster0.t4bgmfd.mongodb.net/?retryWrites=true&w=majority"
  )
    .then((client) => {
      _db = client.db("SocialMediaApp");
      return Promise.all([
        createPostsCollectionWithSchema(),
        createPostStatsCollectionWithSchema(),
        createFriendsCollectionWithSchema(),
      ]);
    })
    .then(() => {
      console.log("Connected to the database.");
      cb();
    })
    .catch((err) => console.log(err));
};

const getDb = () => {
  if (!_db) throw new Error("Database was not initialized");
  else return _db;
};

const createPostsCollectionWithSchema = () => {
  return _db
    .listCollections({ name: "Posts" })
    .toArray()
    .then((collections) => {
      if (collections.length > 0) return Promise.resolve();

      return _db.createCollection("Posts", {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["posts"],
            properties: {
              posts: {
                bsonType: "array",
                items: {
                  bsonType: "object",
                  required: ["createdAt", "_id"],
                  properties: {
                    text: {
                      bsonType: "string",
                      description: "must be a string",
                    },
                    image: {
                      bsonType: "string",
                      description: "must be a string",
                    },
                    createdAt: {
                      bsonType: "date",
                      description: "must be a date and is required",
                    },
                    _id: {
                      bsonType: "objectId",
                      description: "must be of type objectId and is required",
                    },
                  },
                },
              },
            },
          },
        },
      });
    });
};

const createPostStatsCollectionWithSchema = () => {
  return _db
    .listCollections({ name: "PostStats" })
    .toArray()
    .then((collections) => {
      if (collections.length > 0) return Promise.resolve();

      return _db.createCollection("PostStats", {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            properties: {
              totalLikes: {
                bsonType: "int",
                description: "must be a double",
              },
              totalComments: {
                bsonType: "int",
                description: "must be a double",
              },
              commentUsers: {
                bsonType: "array",
                items: {
                  bsonType: "object",
                  required: ["_id", "userId", "text", "createdAt"],
                  properties: {
                    _id: {
                      bsonType: "objectId",
                    },
                    userId: {
                      bsonType: "string",
                    },
                    text: {
                      bsonType: "string",
                    },
                    createdAt: {
                      bsonType: "date",
                    },
                  },
                },
              },
              likeUsers: {
                bsonType: "array",
                items: {
                  bsonType: "string",
                },
              },
            },
          },
        },
      });
    });
};

const createFriendsCollectionWithSchema = () => {
  return _db
    .listCollections({ name: "Friends" })
    .toArray()
    .then((collections) => {
      if (collections.length > 0) return Promise.resolve();

      return _db.createCollection("Friends", {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["friends"],
            properties: {
              friends: {
                bsonType: "array",
                items: {
                  bsonType: "string",
                },
              },
            },
          },
        },
      });
    });
};

module.exports = {
  mongoConnect: mongoConnect,
  getDb: getDb,
};
