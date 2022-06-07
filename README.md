# Steam-Wishlist-Bot
A Discord bot which notifies you when Steam wishlist items go on sale.

## Using the code
Using Node.js, you can either run this repo as a standalone bot, or integrate the code into your own bot. 
Make sure to install all the packages listed in `package.json`.

The core code is everything in the `/src` directory.

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

## Development
The bot will be initially developed to use any MySQL-compatible database. We plan to let it use Replit's inbuilt database too. Or maybe you want another type of NoSQL database? With the database switching system in place, all we need to do is write a DB Wrapper class from scratch for your database type. Open an issue!
