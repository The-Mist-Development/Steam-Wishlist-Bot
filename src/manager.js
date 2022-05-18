const steam = require("./steamlib");
const db = require("./dbwrapper");

module.exports = {
    getSteamGame: function (gameid) {
        return new Promise(function (resolve, reject) {
            let int = parseInt(gameid);
            let check = BigInt("9223372036854775807")
            if (!int || int > check) reject("INVALID_GAME_ID");
            steam.getGameInfo(int.toString()).then(function (response) {
                resolve(response);
            }).catch(function (error) {
                reject(error);
            });
        });
    },
    addUser: function (discordId, steamUrl) {
        return new Promise(function (resolve, reject) {
            db.getUser(discordId).then(function (response) {
                if (response != []) reject("USER_ALREADY_EXISTS");
                if (!steamUrl.includes("steamcommunity.com")) reject("INVALID_URL");
                let steamSnippet = steamUrl.split("steamcommunity.com")[1];
                if (steamSnippet.startsWith("/id/") || steamSnippet.startsWith("/profiles/")) {
                    let array = steamSnippet.split("");
                    if (array[array.length - 1] != "/") steamSnippet = steamSnippet + "/";
                    steam.getUserWishlist(steamSnippet).then(function (response) {
                        db.addUser(discordId, steamSnippet).then(function (response2) {
                            resolve(response);
                        }).catch(function (error2) {
                            reject(error2);
                        })
                    }).catch(function (error) {
                        reject(error);
                    })
                }
                else reject("INVALID_URL");
            }).catch(function (error) {
                reject(error);
            });
        })
    },
    deleteUser: function (discordId) {
        return new Promise(function (resolve, reject) {
            if (discordId.length != 18) reject("INVALID_DISCORD_ID");
            db.getUser(discordId).then(function (response) {
                console.log(JSON.stringify(response))
                if (response == []) reject("USER_NOT_FOUND");
                db.deleteUser(discordId).then(function (response) {
                    resolve(response);
                }).catch(function (error) {
                    reject(error);
                })
            }).catch(function (error) {
                reject(error);
            });
        })
    }
}