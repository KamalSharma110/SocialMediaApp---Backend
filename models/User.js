const mongodb = require("mongodb");
const { getDb } = require("../utils/database");

module.exports = class User {
  constructor(name, username, email, password) {
    this.name = name;
    this.username = username;
    this.email = email;
    this.password = password;
  }

  createUser() {
    const db = getDb();
    return db.collection("Users").insertOne(this);
  }

  static getUserByUsername(username) {
    const db = getDb();
    return db.collection("Users").findOne({ username: { $eq: username } });
  }

  static getUserByEmail(email) {
    const db = getDb();
    return db.collection("Users").findOne({ email: { $eq: email } });
  }

  static updateProfile(userId, profileData) {
    const db = getDb();
    return db.collection("Users").updateOne(
      { _id: new mongodb.ObjectId(userId) },
      {
        $set: {
          ...profileData,
        },
      }
    );
  }

  static getProfile(userId) {
    const db = getDb();
    return db
      .collection("Users")
      .findOne(
        { _id: new mongodb.ObjectId(userId) },
        { '_id': 0, 'coverImage': 1, 'profileImage': 1, 'location': 1, 'occupation': 1, 'username': 1 }
      );
  }
};
