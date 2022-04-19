import { MangaCordClient, MangaCordInterfaces } from "mangacord-framework";
import * as Config from "../../config/config.json";

const client = new MangaCordClient(`Bot ${Config.BOT.TOKEN}`, {
    intents: [
        "guilds",
        "guildMembers",
        "guildMessages"
    ],
    maxShards: "auto",
    autoreconnect: true
});

client.config = Config as MangaCordInterfaces.Config;
client.initClient({
    presence: {
        status: "idle",
        activities: {
            name: "MangaCord Nightly",
            type: 0
        }
    }
});
client.initAllEvents();
