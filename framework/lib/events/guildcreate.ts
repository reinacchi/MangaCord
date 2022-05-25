import { Event } from "../interfaces";
import { GuildModel } from "../models";
import { Logger } from "../util";
import { MangaCordMongoModels } from "../commands";
import { Guild } from "eris";

export const event: Event = {
    name: "guildCreate",
    run: async (client, guild: Guild) => {
        const logger = new Logger();
        const model = GuildModel.createModel(client.database);
        const guildData = await model.findOne({ id: guild.id });

        logger.info({ message: `Joined New Guild: ${guild.name} (${guild.id})`, subTitle: "MangaCordFramework::GuildCreate", title: "GUILD" });

        if (!guildData) {
            MangaCordMongoModels.createGuildModel(client.database, {
                createdAt: new Date(),
                id: guild.id,
                name: guild.name,
                settings: {
                    prefix: client.config.BOT.PREFIX
                }
            });
        }
    }
};
