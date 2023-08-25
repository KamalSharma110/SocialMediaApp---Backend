const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    mongodb_uri : process.env.MONGODB_URI,
    port: process.env.PORT,
    base_url: process.env.BASE_URL,
};