// This is an example bot which utilises our Steam Wishlist code.
// Wishlist Code Setup
require("dotenv").config();
const wishlist = require("./src/manager");

// The rest of this file is just the bad Discord bot I designed to use the code.
const {Client, Intents, MessageEmbed} = require("discord.js");
const { helpembed } = require("./embeds");

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES]});
client.login(process.env.TOKEN);

client.on("ready", () => {
    console.log("Bot online!");
    client.user.setActivity("$help and your wishlists!", {type: "WATCHING"});
});

client.on("messageCreate", async (message) => { 
    if (message.author.bot) return;
    if (!message.content.startsWith("$")) return;
    let args = message.content.slice(1).split(" ");
    let command = args.shift().toLowerCase();

    switch (command) {
        case "help":
            message.channel.send({embeds: [helpembed("$")]});
            break;
        default:
            message.channel.send(`\`${command}\` is not a command. Type \`$help\` to view the list of commands.`);
    }
});