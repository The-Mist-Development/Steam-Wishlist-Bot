const ReplitDBWrapper = require('./database/replit');

let db;
if (process.env.WISHLIST_MODE == "REPLIT") {
    db = new ReplitDBWrapper(process.env.REPLIT_DB_URL);
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
    }
}