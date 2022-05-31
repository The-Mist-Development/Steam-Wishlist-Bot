const ReplitDBWrapper = require('./database/replit');
const MySQLWrapper = require('./database/mysql');

let db;
if (process.env.WISHLIST_MODE == "REPLIT") {
    console.warn("[WARN][Steam-Wishlist-Bot] The Replit Database Wrapper is unfinished! It is highly recommended to use a MySQL-compatible database.");
    db = new ReplitDBWrapper(process.env.REPLIT_DB_URL);
}
else if (process.env.WISHLIST_MODE == "MYSQL") {
    db = new MySQLWrapper(process.env.WISHLIST_DBURL);
}
else {
    throw ("Environment variable WISHLIST_MODE not set");
}

module.exports = {
    addUser(discordId, steamSnippet) {
        return new Promise((resolve, reject) => {
            db.addUser(discordId, steamSnippet).then(function (response) {
                resolve(response);
            }).catch(function (error) {
                reject(error);
            });
        });
    },
    getUser(discordId) {
        return new Promise((resolve, reject) => {
            db.getUser(discordId).then(function (response) {
                resolve(response);
            }).catch(function (error) {
                reject(error);
            });
        });
    },
    deleteUser(discordId) {
        return new Promise((resolve, reject) => {
            db.deleteUser(discordId).then(function (response) {
                resolve(response);
            }).catch(function (error) {
                reject(error);
            });
        });
    }
}