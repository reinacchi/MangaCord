# MangaCord

- **This project is still under the development. Please don't do anything stupid!**

**MangaCord** is a Discord bot that allows you to read manga from [MangaDex](https://mangadex.org). It is included as:

- [MangaCord Discord Bot](https://github.com/reinhello/mangacord/tree/master/bot) ([Eris](https://github.com/abalabahaha/eris))
- [MangaCord Framework](https://github.com/reinhello/mangacord/tree/master/framework)

## Developing

**Node v16 is recommended to run**

Before you begin, make sure to clone the repository and fill out the configuration file (`config/config.json`). Some configuration may be optional but they may not be working at all if you leave them as blank.

**Make sure that you have these following tools before running the bot**:

- [MongoDB](https://mongodb.com)

### Discord Bot


```bash
cd ./framework
npm ci
npm run build

cd ../bot
npm ci
npm start
```

Once you run these commands, the bot will start to connect to Discord gateway and online.

### Additional Commands

These are the additional commands used to test, improve, and fix the code style:

```bash
npm run lint # Runs an ESLint checks
npm run lint:fix # Runs an ESLint fix
```

## Third-Party Resources

These are the third-party resources used in MangaCord. 

- [MangaDex API](https://api.mangadex.org)