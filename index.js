console.log("Process Started");
// This is an example bot which utilises our Steam Wishlist code.
// Wishlist Code Setup
require("dotenv").config();
const wishlist = require("./src/manager");

// The rest of this file and other JS files outside the /src directory are just the bad Discord bot I designed to use the code.
const { Client, Intents, MessageEmbed } = require("discord.js");
const { helpembed, privacyembed } = require("./embeds");

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES], partials: ["CHANNEL"] });
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
        case "register":
            startRegister(message);
            break;
        case "delete":
            unregister(message);
            break;
        case "resync":
            wishlist.resyncSingle(message.author.id).then(function () {
                message.channel.send("✅ Successfully synced our copy of your wishlist with Steam.");
            }).catch(function (err) {
                message.channel.send("❌ Failed to sync your wishlist with Steam. Please try again later.");
                console.log("Error syncing wishlist: " + err);
            });
            break;
        case "list": 
            sendList(message); 
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
        else if (response.is_free) {
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

async function startRegister(message) {
    message.react("📩")
    let embed = new MessageEmbed()
        .setTitle("Send your Steam Profile URL")
        .setColor("#ebc610")
        .addFields(
            {
                name: "Step 1: Open your Steam Profile.",
                value: 'Open the Steam app, hover over your profile name in the top bar, and click "Profile".'
            },
            {
                name: "Step 2: Right-click somewhere on the page to open the context menu.",
                value: "Or if you have opened your profile in a browser, you can simply copy the URL from the address bar."
            },
            {
                name: 'Step 3: Click "Copy Page URL".',
                value: "Then, paste the link here."
            }
        )
    let dm = await message.author.send({ content: "Follow the instructions below to register your Wishlist and enable notifications.", embeds: [embed] });
    let filter = m => m.author.id == message.author.id
    dm.channel.awaitMessages({
        filter,
        max: 1,
        time: 120000,
        errors: ['time']
    }).then(collected => {
        let url = collected.first().content;
        wishlist.addUser(message.author.id, url).then(function (wishlist) {
            let embed2 = new MessageEmbed()
                .setTitle("Success")
                .setDescription("Your Wishlist has successfully been added to our database to alert you when one of your games goes on sale. We will automatically keep your wishlist updated, but you can manually update our copy of it by running `$resync`. To disable notifications, run `$delete`.")
                .setColor("#382bc4")
            embed2.addField("Games currently on your wishlist", "---");
            let keys = Object.keys(wishlist);
            let length = keys.length <= 8 ? keys.length : 8;
            for (let i = 0; i < length; i++) {
                let cprice = wishlist[keys[i]].subs[0] ? wishlist[keys[i]].subs[0].discount_block.split("<div class=\"discount_final_price\">")[1].split("</div>")[0] : "Not available";
                embed2.addField(`\`${keys[i]}\` ${wishlist[keys[i]].name}`, `Estimated price: **${cprice}**`);
            }
            if (keys.length - length > 0) {
                embed2.addField(`Plus ${keys.length - length} more game${keys.length - length > 1 ? "s" : ""}.`, "---");
            }
            dm.channel.send({ embeds: [embed2] });
        }).catch(error => {
            if (error == "INVALID_URL") {
                dm.channel.send("Invalid Steam Profile URL! Registration cancelled.");
            }
            else if (error == "WISHLIST_NOT_FOUND") {
                dm.channel.send("Couldn't find your wishlist! Make sure that your profile URL is correct and that your Game Details are set to public.");
            }
            else if (error == "USER_ALREADY_EXISTS") {
                dm.channel.send("Wait a minute - you are already registered! To update your wishlist, run `$resync`.");
            }
            else {
                console.log(error);
                dm.channel.send("An error occured! Please try again.");
            }
        })
    }).catch(collected => {
        if (collected.size == 0) {
            dm.channel.send("Timed out. Please try again.");
        }
        else dm.channel.send("An error occured. Please try again.")
    })
}

function unregister(message) {
    wishlist.deleteUser(message.author.id).then(function () {
        message.channel.send("Your wishlist has been successfully removed from our database. We will no longer notify you when your games go on sale!");
    }).catch(error => {
        if (error == "USER_NOT_FOUND") {
            message.channel.send("You don't have your wishlist registered!");
        }
        else {
            console.log(error);
            message.channel.send("An error occured. Please try again.");
        }
    })
}

function sendList(message) {
    wishlist.getWishlistFromDB(message.author.id).then(function (response) {
        let embed = new MessageEmbed()
            .setTitle("Your Wishlist")
            .setDescription("This is the list of games we will notify you about. To update our copy of your wishlist, run `$resync` - though this automatically happens once every 24 hours.")
            .setColor("#de66d0")
        for (let i = 0; i < response.length; i++) {
            if (response[i].price_overview) {
                embed.addField(`\`${response[i].steam_appid}\` ${response[i].name}`, `Price: **${response[i].price_overview.final_formatted}** (${response[i].price_overview.discount_percent > 0 ? `**${response[i].price_overview.discount_percent}%** Discount` : `Full Price`})`, false);
            }
            else if (response[i].is_free) {
                embed.addField(`\`${response[i].steam_appid}\` ${response[i].name}`, "Price: **Free**", false);
            }
            else {
                embed.addField(`\`${response[i].steam_appid}\` ${response[i].name}`, "Price: **Unknown** / not available", false);
            }
        }
        message.channel.send({ embeds: [embed] });
    }).catch(function (error) {
        if (error == "USER_NOT_FOUND") {
            message.channel.send("You don't have your wishlist registered!");
        }
        else if (error == "GAME_NOT_FOUND") {
            message.channel.send("Couldn't find one or more of the games on your wishlist! Run `$resync` to update our copy.");
        }
        else {
            console.log(error);
            message.channel.send("An error occured. Please try again.");
        }
    })
}