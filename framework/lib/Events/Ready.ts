import { Event } from "../Interfaces";
import { GuildModel } from "../Models";
import { MangaCordMongoModels } from "../Commands";

export const event: Event = {
    name: "ready",
    run: async (client) => {
        const guilds = client.guilds.map((guild) => guild.id);

        if (client.ready) {
            client.logger.info({ console: "log", message: `${client.user.username}#${client.user.discriminator} Connected`, subTitle: "MangaCordFramework::Gateway", title: "CLIENT", type: "INFO" });
        }

        if (client.database) {
            client.logger.info({ console: "log", message: "Connected To Database", subTitle: "MangaCordFramework::MongoDB", title: "DATABASE", type: "INFO" });
        } else {
            client.logger.error({ console: "error", message: "Unable To Connect To Database", subTitle: "MangaCordFramework::Database", title: "MONGODB", type: "ERROR" });
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
                        locale: "en",
                        prefix: client.config.BOT.PREFIX
                    }
                });
            }
        }
    }
};
