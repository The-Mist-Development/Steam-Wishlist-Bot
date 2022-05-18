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
        this.connection.query("CREATE TABLE IF NOT EXISTS users (discordId VARCHAR(255) PRIMARY KEY, steamSnippet VARCHAR(255))", function (error, results, fields) {
            if (error) console.log("Error creating table 1 to MySQL: " + error);
        });
        this.connection.query("CREATE TABLE IF NOT EXISTS games (gameId VARCHAR(255) PRIMARY KEY, discordUsers LONGTEXT);", function (error, results, fields) {
            if (error) console.log("Error creating table 2 in MySQL: " + error);
        });
    }
    addUser(discordId, steamSnippet) {
        return new Promise((resolve, reject) => {
            this.connection.query("INSERT INTO users (discordId, steamSnippet) VALUES (?, ?)", [discordId, steamSnippet], function (error, results, fields) {
                if (error) reject(error);
                resolve(results);
            });
        });
    }
    getUser(discordId) {
        return new Promise((resolve, reject) => {
            this.connection.query("SELECT * FROM users WHERE discordId = ?", [discordId], function (error, results, fields) {
                if (error) reject(error);
                resolve(results);
            });
        });
    }
    deleteUser(discordId) {
        return new Promise((resolve, reject) => {
            this.connection.query("DELETE FROM users WHERE discordId = ?", [discordId], function (error, results, fields) {
                if (error) reject(error);
                resolve(results);
            });
        });
    }
}

module.exports = MySQLWrapper;