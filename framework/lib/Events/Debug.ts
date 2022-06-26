import { Event } from "../Interfaces";

export const event: Event = {
    name: "debug",
    run: async (client, message: string, id: number) => {
        if (client.config.BOT.DEBUG_MODE) {
            client.logger.log({ colour: "#FFDD1C", console: "log", message, subTitle: "MangaCordFramework::Eris::Debug", title: `SHARD ${id || "N/A"}`, type: "DEBUG" });
        }
    }
}
