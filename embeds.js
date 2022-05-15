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
                    value: "Starts the process (which continues in DMs) of acquiring your Steam wishlist, so we can notify you when games on it go on sale."
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
    },
    privacyembed: function () {
        return new MessageEmbed()
            .setTitle("Privacy")
            .setColor("#10b555")
            .setDescription("The original source code for the bot can be found [here](https://github.com/The-Mist-Development/Steam-Wishlist-Bot). \r Steam Wishlist Bot is not affiliated with Valve or Steam.")
            .addFields(
                {
                    name: "Data we store",
                    value: "When you register, we store part of your Steam profile link and your Discord ID in our database. This allows us to update which games we should notify you about when your wishlist changes. \r We also store Steam's Game ID for all of the games in your wishlist, along with your Discord ID. This allows us to notify you when we detect a sale."
                },
                {
                    name: "How we access data from Steam",
                    value: "Steam has a public API which can be accessed without an API key. We can get Wishlist data from any profile with Game Details set to public. Also, we can see information about any game, including the price and whether it's on sale."
                },
                {
                    name: "How we can tell when information changes",
                    value: "We don't know immediately when you have changed your wishlist or a game goes on sale. This is because we update our data at a set interval - every 24 hours for wishlists (unless you trigger a manual resync) and every hour for game prices."
                }
            )
    }
}