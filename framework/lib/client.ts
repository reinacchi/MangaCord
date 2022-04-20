import { ActivityPartial, BotActivityType, Client, Status, TextableChannel } from "eris";
import { Collection } from "./util";
import { Command, Config, Event } from "./interfaces";
import { Connection } from "mongoose";
import { MangaCordDatabase } from "./database";
import { join } from "path";
import { readdirSync } from "fs";
import { MessageCollector, MessageCollectorOptions } from "./util/messagecollector";

interface InitClientOptions {
    presence?: {
        status: Status;
        activities?: ActivityPartial<BotActivityType> | ActivityPartial<BotActivityType>[];
    }
}

export class MangaCordClient extends Client {
    public commands = new Collection<Command>();

    public config: Config;

    public database: Connection;

    public events = new Collection<Event>();

    public awaitChannelMessages(channel: TextableChannel, options: MessageCollectorOptions) {
        return new MessageCollector(channel, options).run();
    }

    public initAllEvents() {
        this.initCommands();
        this.initErrorEvent();
        this.initGuildCreateEvent();
        this.initMessageCreateEvent();
        this.initReadyEvent();
        this.initShardReadyEvent();
    }

    public initClient(options: InitClientOptions) {
        this.connect();
        this.database = new MangaCordDatabase(`mongodb+srv://${this.config.MONGODB.HOST}/${this.config.MONGODB.NAME}`).connect();

        if (options.presence) {
            this.editStatus(options.presence.status, options.presence.activities);
        }
    }

    public initCommands() {
        const commandPath = join(__dirname, "..", "..", "bot", "src", "commands");

        readdirSync(commandPath).forEach(async (dir) => {
            const commands = readdirSync(`${commandPath}/${dir}`).filter((file) => file.endsWith(".ts"));

            for (const file of commands) {
                const { command } = await import(`${commandPath}/${dir}/${file}`);

                this.commands.set(command.name, command);
            }
        });
    }

    public async initErrorEvent() {
        const path = join(__dirname, "events", "error.js");
        const { event } = await import(path);

        this.on(event.name, event.run.bind(null, this));
    }

    public async initGuildCreateEvent() {
        const path = join(__dirname, "events", "guildcreate.js");
        const { event } = await import(path);

        this.on(event.name, event.run.bind(null, this));
    }

    public async initMessageCreateEvent() {
        const path = join(__dirname, "events", "messagecreate.js");
        const { event } = await import(path);

        this.on(event.name, event.run.bind(null, this));
    }

    public async initReadyEvent() {
        const path = join(__dirname, "events", "ready.js");
        const { event } = await import(path);

        this.on(event.name, event.run.bind(null, this));
    }

    public async initShardReadyEvent() {
        const path = join(__dirname, "events", "shardpreready.js");
        const { event } = await import(path);

        this.on(event.name, event.run.bind(null, this));
    }
}
