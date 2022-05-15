const axios = require('axios').default;

module.exports = {
    getGameInfo: function(gameid) {
        return new Promise(function(resolve, reject) {
            axios.get(`https://store.steampowered.com/api/appdetails?appids=${gameid}`)
            .then(function(response) {
                if (response.data[gameid].success) {
                    resolve(response.data[gameid].data);
                } else reject("GAME_NOT_FOUND");
            })
            .catch(function(error) {
                reject(error.toString());
            });
        });
    }
}