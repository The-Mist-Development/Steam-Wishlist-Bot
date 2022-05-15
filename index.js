// This is an example bot which utilises our Steam Wishlist code.
// Wishlist Code Setup
require("dotenv").config();
const wishlist = require("./src/manager");

// The rest of this file and other JS files outside the /src directory are just the bad Discord bot I designed to use the code.
const { Client, Intents, MessageEmbed } = require("discord.js");
const { helpembed, privacyembed } = require("./embeds");

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });
client.login(process.env.TOKEN);

client.on("ready", () => {
    console.log("Bot online!");
    client.user.setActivity("$help and your wishlists!", { type: "WATCHING" });
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith("$")) return;
    let args = message.content.slice(1).split(" ");
    let command = args.shift().toLowerCase();

    switch (command) {
        case "help":
            message.channel.send({ embeds: [helpembed("$")] });
            break;
        case "privacy":
            message.channel.send({ embeds: [privacyembed("$")] });
            break;
        case "game":
            if (args[0]) sendGameInfo(message, args[0]);
            else message.channel.send("Please provide a Steam Game ID.");
            break;
        default:
            message.channel.send(`\`${command}\` is not a command. Type \`$help\` to view the list of commands.`);
    }
});

function sendGameInfo(message, id) {
    wishlist.getSteamGame(id).then(function (response) {
        let embed = new MessageEmbed()
            .setTitle(response.name)
            .setDescription(response.short_description)
            .setImage(response.header_image)
            .setColor("#de66d0")
        if (response.price_overview) {
            embed.addFields(
                {
                    name: `Price: ${response.price_overview.final_formatted}`,
                    value: response.price_overview.discount_percent > 0 ? `Discount: ${response.price_overview.discount_percent}%` : "Currently no discount."
                },

            )
        }
        else if (response.is_free){
            embed.addFields(
                {
                    name: "Price: Free",
                    value: "You can't get more discounted than that!"
                }
            )
        }
        else {
            embed.addFields(
                {
                    name: "Price: Unknown",
                    value: "This game may not be available for purchase."
                }
            )
        }
        message.channel.send({ embeds: [embed] });
    }).catch(function (error) {
        if (error == "GAME_NOT_FOUND") {
            message.channel.send("**Game not found**. Please ensure the Steam ID is correct.");
        }
        else if (error == "INVALID_GAME_ID") {
            message.channel.send("Please provide a valid Steam Game ID.")
        }
        else {
            console.log("Error getting game from Steam: " + error);
            message.channel.send("An error occured! Try again later.");
        }
    });
}