import { Event } from "../interfaces";
import { GuildModel } from "../models";
import { Logger } from "../util";
import { MangaCordMongoModels } from "../commands";

export const event: Event = {
    name: "ready",
    run: async (client) => {
        const logger = new Logger();
        const guilds = client.guilds.map((guild) => guild.id);

        if (client.ready) {
            logger.info({ message: `${client.user.username}#${client.user.discriminator} Connected`, subTitle: "MangaCordFramework::Gateway", title: "CLIENT", type: "INFO" });
        }

        if (client.database) {
            logger.info({ message: "Connected To Database", subTitle: "MangaCordFramework::MongoDB", title: "DATABASE", type: "INFO" });
        } else {
            logger.error({ message: "Unable To Connect To Database", subTitle: "MangaCordFramework::Database", title: "MONGODB", type: "ERROR" });
        }

        // Create database for guild
        for (let i = 0; i < guilds.length; i++) {
            const model = GuildModel.createModel(client.database);
            const guildData = await model.findOne({ id: guilds[i] });

            if (!guildData) {
                MangaCordMongoModels.createGuildModel(client.database, {
                    createdAt: new Date(),
                    id: guilds[i],
                    name: client.guilds.get(guilds[i]).name,
                    settings: {
                        prefix: client.config.BOT.PREFIX
                    }
                });
            }
        }
    }
};
