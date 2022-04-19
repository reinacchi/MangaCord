import { Event } from "../interfaces";
import { Logger } from "../util";

export const event: Event = {
    name: "shardPreReady",
    run: async (client, id: number) => {
        const logger = new Logger();

        logger.system({ message: `Shard ${id} Connected`, subTitle: "MangaCordFramework::Gateway", title: "SHARD", type: "SYSTEM" });
    }
};
