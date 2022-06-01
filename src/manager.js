const steam = require("./steamlib");
const db = require("./dbwrapper");
const CronJob = require('cron').CronJob;

// Exports
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
                if (JSON.stringify(response) != "[]") reject("USER_ALREADY_EXISTS");
                if (!steamUrl.includes("steamcommunity.com")) reject("INVALID_URL");
                let steamSnippet = steamUrl.split("steamcommunity.com")[1];
                if (steamSnippet.startsWith("/id/") || steamSnippet.startsWith("/profiles/")) {
                    let array = steamSnippet.split("");
                    if (array[array.length - 1] != "/") steamSnippet = steamSnippet + "/";
                    steam.getUserWishlist(steamSnippet).then(function (response) {
                        db.addUser(discordId, steamSnippet).then(function (response2) {
                            resyncSingle(discordId, response);
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
                if (JSON.stringify(response) == "[]") reject("USER_NOT_FOUND");
                db.deleteUser(discordId).then(function (response) {
                    resolve(response);
                }).catch(function (error) {
                    reject(error);
                })
            }).catch(function (error) {
                reject(error);
            });
        })
    },
    getWishlistFromDB(discordId) {
        return new Promise(function (resolve, reject) {
            db.getUser(discordId).then(function (response) {
                if (JSON.stringify(response) == "[]") reject("USER_NOT_FOUND");
                let games = response[0].gameList.split("&");
                let finalArr = [];
                for (let i = 0; i < games.length; i++) {
                    steam.getGameInfo(games[i]).then(function (response) {
                        finalArr.push(response);
                        if (finalArr.length == games.length) {
                            resolve(finalArr);
                        }
                    }).catch(function (error) {
                        reject(error);
                    })
                }
            }).catch(function (error) {
                reject(error);
            });
        })
    }
}

function resyncSingle(discordId, steamWishlist = null) {
    if (steamWishlist == null) {
        return new Promise(function (resolve, reject) {
            db.getUser(discordId).then(function (response) {
                if (JSON.stringify(response) == "[]") reject("USER_NOT_FOUND");
                steam.getUserWishlist(response[0].steamSnippet).then(function (response) {
                    let keys = Object.keys(response);
                    db.writeWishlist(discordId, keys).then(function (response) {
                        resolve(response);
                    }).catch(function (error) {
                        reject(error);
                    })
                }).catch(function (error) {
                    reject(error);
                })
            })
        });
    }
    else {
        let keys = Object.keys(steamWishlist);
        db.writeWishlist(discordId, keys).then(function (response) {
            return;
        }).catch(function (error) {
            console.log("[WISHLIST] Error setting wishlist with provided data: " + error);
        })
    }
}

module.exports.resyncSingle = resyncSingle;

// Cron Jobs
let wishlistSync = new CronJob(
    '0 0 12 * * *',
    function () {
        console.log("[WISHLIST] Starting daily wishlist sync.");
        db.getAllUsers().then(function (response) {
            for (let i = 0; i < response.length; i++) {
                resyncSingle(response[i].discordId);
            }
            console.log("[WISHLIST] Command issued for all wishlists to be synced with Steam.");
        }).catch(function (error) {
            console.log("[WISHLIST] Error automatically syncing wishlists in daily Cron job: " + error);
        })
    },
    null,
    true,
    'Europe/London'
);

let gamePriceSync = new CronJob(
    '0 30 * * * *',
    function () {
        console.log("[WISHLIST] Starting hourly game price sync.");
        db.getAllUsers().then(function (response) {
            let gamesObj = {};
            for (let i = 0; i < response.length; i++) {
                let games = response[i].gameList.split("&");
                for (let j = 0; j < games.length; j++) {
                    if (gamesObj[games[j]] == undefined) {
                        gamesObj[games[j]] = [response[i].discordId];
                    }
                    else {
                        gamesObj[games[j]].push(response[i].discordId);
                    }
                }
            }
            let games = Object.keys(gamesObj);
            for (let i = 0; i < games.length; i++) {
                steam.getGameInfo(games[i]).then(function (response) {
                    db.updateGame(games[i], response.price_overview.final).then(function (oldPrice) {
                        if (oldPrice == -1) {
                            console.log(`[WISHLIST][DEBUG] Game ${games[i]} not previously in database.`);
                        }
                        else if (oldPrice == response.price_overview.final) {
                            console.log(`[WISHLIST][DEBUG] Game ${games[i]} price has not changed.`);
                        }
                        else if (response.price_overview.final < oldPrice) {
                            if (response.price_overview.discount_percent > 0) {
                                console.log(`[WISHLIST][DEBUG] Game ${games[i]} has a discount of ${response.price_overview.discount_percent}%.`);
                                // DM the users
                            }
                        }
                        else if (response.price_overview.final > oldPrice) {
                            console.log(`[WISHLIST][DEBUG] Game ${games[i]} has risen in price.`);
                            // DM the users
                        }
                    }).catch(function (error) {
                        console.log("[WISHLIST] Error updating game price in hourly Cron job: " + error);
                    });
                }).catch(function (error) {

                })
            }
        }).catch(function (error) {
            console.log("[WISHLIST] Error automatically syncing game prices in hourly Cron job: " + error);
        })
    },
    null,
    true,
    'Europe/London'
);