const { getDb } = require("../utils/database");


module.exports = class Post {
    // constructor(userId, text, file){
    //     userId = this.userId;
    //     text = this.text;
    //     file = this.file;
    // }

    static createPost(postData){
        const db = getDb();
        return db.collection('Posts').insertOne(postData);
    }
};