const { getDb } = require("../utils/database");


module.exports = class User{

    constructor(name, username, email, password){
        this.name = name;
        this.username = username;
        this.email = email;
        this.password = password;
    }

    createUser(){
        const db = getDb();
        return db.collection('Users').insertOne(this);
    }
    
    static getUserByUsername(username){
        const db = getDb();
        return db.collection('Users').findOne({ username: { $eq: username } });
    }
    
    static getUserByEmail(email){
        const db = getDb();
        return db.collection('Users').findOne({ email: { $eq: email } });
    }
};