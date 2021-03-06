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
        this.connection.query("CREATE TABLE IF NOT EXISTS wishlist_users (discordId VARCHAR(255) PRIMARY KEY, steamSnippet VARCHAR(255), gameList LONGTEXT);", function (error, results, fields) {
            if (error) console.log("[WISHLIST] Error creating wishlist_users table in MySQL: " + error);
        });
        this.connection.query("CREATE TABLE IF NOT EXISTS wishlist_games (gameId VARCHAR(255) PRIMARY KEY, lastPrice VARCHAR(255));", function (error, results, fields) {
            if (error) console.log("[WISHLIST] Error creating wishlist_games table in MySQL: " + error);
        });
    }
    addUser(discordId, steamSnippet) {
        return new Promise((resolve, reject) => {
            this.connection.query("INSERT INTO wishlist_users (discordId, steamSnippet) VALUES (?, ?)", [discordId, steamSnippet], function (error, results, fields) {
                if (error) reject(error);
                resolve(results);
            });
        });
    }
    getUser(discordId) {
        return new Promise((resolve, reject) => {
            this.connection.query("SELECT * FROM wishlist_users WHERE discordId = ?", [discordId], function (error, results, fields) {
                if (error) reject(error);
                resolve(results);
            });
        });
    }
    deleteUser(discordId) {
        return new Promise((resolve, reject) => {
            this.connection.query("DELETE FROM wishlist_users WHERE discordId = ?", [discordId], function (error, results, fields) {
                if (error) reject(error);
                resolve(results);
            });
        });
    }
    writeWishlist(discordId, wishlistString) {
        return new Promise((resolve, reject) => {
            this.connection.query("UPDATE wishlist_users SET gameList = ? WHERE discordId = ?", [wishlistString, discordId], function (error, results, fields) {
                if (error) reject(error);
                resolve(results);
            });
        })
    }
    getAllUsers() {
        return new Promise((resolve, reject) => {
            this.connection.query("SELECT * FROM wishlist_users", function (error, results, fields) {
                if (error) reject(error);
                resolve(results);
            });
        });
    }
    updateGame(gameId, price) {

        // Internal function declaration
        const insertIntoGames = (gameId, price, resolve, reject) => {
            this.connection.query("INSERT INTO wishlist_games (gameId, lastPrice) VALUES (?, ?)", [gameId, price], function (error, results, fields) {
                if (error) reject(error);
                resolve(-1);
            });
        }
        const updateGames = (gameId, price, oldPrice, resolve, reject) => {
            this.connection.query("UPDATE wishlist_games SET lastPrice = ? WHERE gameId = ?", [price, gameId], function (error, results, fields) {
                if (error) reject(error);
                resolve(oldPrice);
            });
        }

        return new Promise((resolve, reject) => {
            this.connection.query("SELECT * FROM wishlist_games WHERE gameId = ?", [gameId], function (error, results, fields) {
                if (error) reject(error);
                if (results.length < 1) {
                    insertIntoGames(gameId, price, resolve, reject);
                }
                else {
                    updateGames(gameId, price, results[0].lastPrice, resolve, reject);
                }
            });
        });
    }
}

module.exports = MySQLWrapper;