let _io;
let users = {};

module.exports = {
    init: (httpServer) => {
        _io = require('socket.io')(httpServer, {
            cors: {
                origin: 'http://localhost:3000',
                methods: ["GET", "POST", "PUT", "DELETE"],
            }
        });
        return _io;
    },
    getIO: () => {
        if(_io) return _io;
        else throw new Error('socket connection is not initialised');
    },
    getUsers: () => {
        return users;
    }
};