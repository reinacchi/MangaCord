import { Event } from "../Interfaces";

export const event: Event = {
    name: "shardPreReady",
    run: async (client, id: number) => {
        client.logger.system({ console: "log", message: `Shard ${id} Connected`, subTitle: "MangaCordFramework::Gateway", title: "SHARD", type: "SYSTEM" });
    }
};
