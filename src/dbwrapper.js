const ReplitDBWrapper = require('./database/replit');
const MySQLWrapper = require('./database/mysql');

let db;
if (process.env.WISHLIST_MODE == "REPLIT") {
    console.warn("[WISHLIST][WARN] The Replit Database Wrapper is unfinished! It is highly recommended to use a MySQL-compatible database.");
    db = new ReplitDBWrapper(process.env.REPLIT_DB_URL);
}
else if (process.env.WISHLIST_MODE == "MYSQL") {
    db = new MySQLWrapper(process.env.WISHLIST_DBURL);
}
else {
    throw ("[WISHLIST] Environment variable WISHLIST_MODE not set");
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
    },
    writeWishlist(discordId, gameList) {
        return new Promise((resolve, reject) => {
            let wishlistString = gameList.join("&");
            db.writeWishlist(discordId, wishlistString).then(function (response) {
                resolve(response);
            }).catch(function (error) {
                reject(error);
            })
        })
    },
    getAllUsers() {
        return new Promise((resolve, reject) => {
            db.getAllUsers().then(function (response) {
                resolve(response);
            }).catch(function (error) {
                reject(error);
            });
        });
    },
    updateGame(gameId, price) {
        return new Promise((resolve, reject) => {
            db.updateGame(gameId, price).then(function (response) {
                resolve(response);
            }).catch(function (error) {
                reject(error);
            });
        });
    }
}