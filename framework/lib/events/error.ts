import { Event } from "../interfaces";
import { Logger } from "../util";

export const event: Event = {
    name: "error",
    run: (client, err: string, id: number) => {
        const logger = new Logger();

        logger.error({ message: err, subTitle: "MangaCordFramework::Gateway", title: `SHARD ${id ? id : "N/A"}`, type: "ERROR" });
    }
};

process.on("unhandledRejection", (err: string) => {
    const logger = new Logger();

    logger.error({ message: err, subTitle: "TypeScript::Error", title: "UNHANDLED REJECTION" });
});
