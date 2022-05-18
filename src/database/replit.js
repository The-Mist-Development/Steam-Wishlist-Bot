const axios = require("axios");

class ReplitDBWrapper {
    constructor(dbUrl) {
        this.dbUrl = dbUrl;
    }
    addUser(discordId, steamSnippet) {
        return new Promise((resolve, reject) => {
            let key = "@" + discordId;
            axios.post(this.dbUrl, { key: steamSnippet }).then(function (response) {
                resolve(response.data);
            }).catch(function (error) {
                reject(error);
            });
        });
    }
    getUser(discordId) {
        return new Promise((resolve, reject) => {
            let key = "@" + discordId;
            axios.get(this.dbUrl + "/" + key).then(function (response) {
                resolve(response.data);
            }).catch(function (error) {
                reject(error);
            });
        });
    }
}

module.exports = ReplitDBWrapper;