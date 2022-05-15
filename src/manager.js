const steam = require("./steamlib");

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
            //TODO Check if user already exists
            if (!steamUrl.includes("steamcommunity.com")) reject("INVALID_URL");
            let steamSnippet = steamUrl.split("steamcommunity.com")[1];
            if (steamSnippet.startsWith("/id/") || steamSnippet.startsWith("/profiles/")) {
                let array = steamSnippet.split("");
                if (array[array.length - 1] != "/") steamSnippet = steamSnippet + "/";
                steam.getUserWishlist(steamSnippet).then(function (response) {
                    //TODO Add user to database
                    resolve(response);
                }).catch(function (error) {
                    reject(error);
                })
            }
            else reject("INVALID_URL");
        })
    }
}