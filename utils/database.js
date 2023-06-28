const mongodb = require('mongodb');

let _db;

const mongoConnect = (cb) => {
    mongodb.MongoClient.connect('mongodb+srv://kamal2507s:Kamalsharma1$@cluster0.t4bgmfd.mongodb.net/?retryWrites=true&w=majority').then(client => {
        _db = client.db('SocialMediaApp');
        console.log('Connected to the database.');
        cb();
    }).catch(err => next(err));
};

const getDb = () => {
    if(!_db) throw new Error('Database was not initialized');
    else return _db;
};

module.exports = {
    mongoConnect: mongoConnect,
    getDb: getDb,
};