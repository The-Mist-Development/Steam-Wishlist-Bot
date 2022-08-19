# Steam-Wishlist-Bot
A simple Discord bot which notifies you when Steam wishlist items go on sale.

## Using the code
Using Node.js, you can run this repo as a standalone bot, but feel free to integrate the code into your own bot. 
Make sure to install all the packages listed in `package.json`. Make sure to include all the `.env` variables shown in `.env.default` (or change them where they appear in the code).

To run the repo, just run `node index.js`.

The core code is everything in the `/src` directory. I adapted the index.js file for use in [my own bot](https://github.com/The-Mist-Development/The-Mist-Bot), to process the user commands. If you want, you can rewrite this completely (though I haven't provided any documentation - sorry!). 

Setup to copy into your own bot:
```js
require("dotenv").config();

// Import the manager.js file
const wishlist = require("./src/manager");

// IMPORTANT: In your bot's ready event:
client.on("ready", () => {
    wishlist.setup(client);
});
```
Make sure your bot has the `GUILD_MESSAGES` and `DIRECT_MESSAGES` intents (`GatewayIntentBits.GuildMessages` and `GatewayIntentBits.DirectMessages` in newer versions).

Most of the command handling and sending back the message to the user comes from the index.js.
HOWEVER, one message comes from within the manager.js: the message notifying that a game is on sale (line 171).

## Development
The bot will be initially developed to use any MySQL-compatible database. We plan to let it use Replit's inbuilt database too. Or maybe you want another type of NoSQL database? With the database switching system in place, all we need to do is write a DB Wrapper class from scratch for your database type. Open an issue!
