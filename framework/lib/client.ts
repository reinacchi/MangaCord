import { ActivityPartial, BotActivityType, Client, Status, TextableChannel } from "eris";
import { Collection } from "./Util";
import { Command, Config, Event } from "./Interfaces";
import { Connection } from "mongoose";
import { Logger } from "./Util";
import { MangaCordDatabase } from "./Database";
import { join } from "path";
import { readdirSync } from "fs";
import { use } from "i18next";
import i18nNextICU from "i18next-icu";
import { MessageCollector, MessageCollectorOptions } from "./Util/MessageCollector";
import { MangaCordManager } from "./Manager";
import localeEN from "./locales/en.json";
import localeID from "./locales/id.json";

type AvailableLocale = "en" | "id";

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

    public logger = new Logger();

    public manager = new MangaCordManager(this);

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

        setTimeout(() => {
            this.logger.success({ console: "log", message: `Loaded ${this.commands.size} Commands`, subTitle: "MangaCordFramework::Collection", title: "COMMANDS" });
            this.logger.success({ console: "log", message: `Loaded ${this.events.size} Events`, subTitle: "MangaCordFramework::Collection", title: "EVENTS" });
            this.logger.success({ console: "log", message: "Loaded Localisations", subTitle: "MangaCordResources::Localisation", title: "LOCALE" });
        }, 300);
    }

    public initClient(options: InitClientOptions) {
        this.connect();
        this.database = new MangaCordDatabase(`mongodb+srv://${this.config.MONGODB.HOST}/${this.config.MONGODB.NAME}`).connect();

        if (options.presence) {
            this.editStatus(options.presence.status, options.presence.activities);
        }
    }

    public initCommands() {
        const commandPath = join(__dirname, "..", "..", "bot", "src", "Commands");

        readdirSync(commandPath).forEach(async (dir) => {
            const commands = readdirSync(`${commandPath}/${dir}`).filter((file) => file.endsWith(".ts"));

            for (const file of commands) {
                const { command } = await import(`${commandPath}/${dir}/${file}`);

                this.commands.set(command.name, command);
            }
        });

    }

    public async initErrorEvent() {
        const path = join(__dirname, "Events", "Error.js");
        const { event } = await import(path);

        this.events.set(event.name, event);
        this.on(event.name, event.run.bind(null, this));
    }

    public async initGuildCreateEvent() {
        const path = join(__dirname, "Events", "GuildCreate.js");
        const { event } = await import(path);

        this.events.set(event.name, event);
        this.on(event.name, event.run.bind(null, this));
    }

    public initLocale(locale: AvailableLocale) {
        return use(i18nNextICU).init({
            fallbackLng: "en",
            lng: locale,
            resources: {
                en: {
                    translation: localeEN
                },
                id: {
                    translation: localeID
                }
            }
        });
    }

    public async initMessageCreateEvent() {
        const path = join(__dirname, "Events", "MessageCreate.js");
        const { event } = await import(path);

        this.events.set(event.name, event);
        this.on(event.name, event.run.bind(null, this));
    }

    public async initReadyEvent() {
        const path = join(__dirname, "Events", "Ready.js");
        const { event } = await import(path);

        this.events.set(event.name, event);
        this.on(event.name, event.run.bind(null, this));
    }

    public async initShardReadyEvent() {
        const path = join(__dirname, "Events", "ShardPreReady.js");
        const { event } = await import(path);

        this.events.set(event.name, event);
        this.on(event.name, event.run.bind(null, this));
    }

    /* @ts-ignore */
    public async translate(key: string | string[], variable?: object): Promise<string>;

    /* @ts-ignore */
    public async translateLocale(locale: AvailableLocale, key: string | string[], variable?: object): Promise<string>;
}
