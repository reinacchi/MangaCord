import { Event } from "../Interfaces";
import { GuildModel } from "../Models";
import { MangaCordMongoModels } from "../Commands";
import { Guild } from "eris";

export const event: Event = {
    name: "guildCreate",
    run: async (client, guild: Guild) => {
        const model = GuildModel.createModel(client.database);
        const guildData = await model.findOne({ id: guild.id });

        client.logger.info({ console: "log", message: `Joined New Guild: ${guild.name} (${guild.id})`, subTitle: "MangaCordFramework::GuildCreate", title: "GUILD" });

        if (!guildData) {
            MangaCordMongoModels.createGuildModel(client.database, {
                createdAt: new Date(),
                id: guild.id,
                name: guild.name,
                settings: {
                    locale: "en",
                    prefix: client.config.BOT.PREFIX
                }
            });
        }
    }
};
