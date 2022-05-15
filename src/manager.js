const steam = require("./steamlib");

module.exports = {
    getSteamGame: function(gameid) {
        return new Promise(function(resolve, reject) {
            let int = parseInt(gameid);
            let check = BigInt("9223372036854775807")
            if (!int || int > check) reject("INVALID_GAME_ID");
            steam.getGameInfo(int.toString()).then(function(response) {
                resolve(response);
            }).catch(function(error) {
                reject(error);
            });
        });
    }
}