const { MessageEmbed } = require("discord.js");

module.exports = {
    helpembed: function (prefix) {
        return new MessageEmbed()
            .setTitle("Commands")
            .setColor("#2058b3")
            .setDescription("This bot was designed to notify Discord users when games on their Steam wishlist go on sale. \r The original source code can be found [here](https://github.com/The-Mist-Development/Steam-Wishlist-Bot). \r Steam Wishlist Bot is not affiliated with Valve or Steam.")
            .addFields(
                {
                    name: `\`${prefix}help\``,
                    value: "Gives you a list of the bot's commands"
                },
                {
                    name: `\`${prefix}register\``,
                    value: "Starts the process (which continues in DM) of acquiring your Steam wishlist, so we can notify you when games on it go on sale."
                },
                {
                    name: `\`${prefix}list\``,
                    value: "Displays a list of the games you will be notified about."
                },
                {
                    name: `\`${prefix}resync\``,
                    value: "Manually syncs your Steam wishlist. This happens automatically every 24 hours."
                },
                {
                    name: `\`${prefix}delete\``,
                    value: "Deletes your wishlist from our database."
                },
                {
                    name: `\`${prefix}privacy\``,
                    value: "Provides information about data we store, and how the bot works."
                },
                {
                    name: `\`${prefix}game\``,
                    value: "Looks up a Steam game by ID and provides information about it. This was initially intended for debugging."
                }
            )
    }
}