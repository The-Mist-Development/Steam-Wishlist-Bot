const mysql = require("mysql2");

class MySQLWrapper {
    constructor(dbUrl) {
        this.connection = mysql.createConnection({
            host: dbUrl.split("@")[1].split("/")[0],
            user: dbUrl.split("mysql://")[1].split(":")[0],
            database: dbUrl.split("@")[1].split("/")[1].split("?")[0],
            password: dbUrl.split(":")[2].split("@")[0],
            ssl: {
                rejectUnauthorized: false
              }
          });
        this.connection.query("CREATE TABLE IF NOT EXISTS wishlist (discordId VARCHAR(255) PRIMARY KEY, steamSnippet VARCHAR(255), gameList LONGTEXT);", function (error, results, fields) {
            if (error) console.log("[WISHLIST] Error creating wishlist table in MySQL: " + error);
        });
    }
    addUser(discordId, steamSnippet) {
        return new Promise((resolve, reject) => {
            this.connection.query("INSERT INTO wishlist (discordId, steamSnippet) VALUES (?, ?)", [discordId, steamSnippet], function (error, results, fields) {
                if (error) reject(error);
                resolve(results);
            });
        });
    }
    getUser(discordId) {
        return new Promise((resolve, reject) => {
            this.connection.query("SELECT * FROM wishlist WHERE discordId = ?", [discordId], function (error, results, fields) {
                if (error) reject(error);
                resolve(results);
            });
        });
    }
    deleteUser(discordId) {
        return new Promise((resolve, reject) => {
            this.connection.query("DELETE FROM wishlist WHERE discordId = ?", [discordId], function (error, results, fields) {
                if (error) reject(error);
                resolve(results);
            });
        });
    }
    writeWishlist(discordId, wishlistString) {
        return new Promise((resolve, reject) => {
            this.connection.query("UPDATE wishlist SET gameList = ? WHERE discordId = ?", [wishlistString, discordId], function (error, results, fields) {
                if (error) reject(error);
                resolve(results);
            });
        })
    }
}

module.exports = MySQLWrapper;