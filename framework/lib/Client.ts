import { ActivityPartial, BotActivityType, Client, Status, TextableChannel } from "eris";
import { Collection } from "./Util";
import { Command, Config, Event } from "./Interfaces";
import { Connection } from "mongoose";
import { Logger } from "./Util";
import { MangaCordDatabase } from "./Database";
import { join } from "path";
import { readdirSync } from "fs";
import { t, TFunction, use } from "i18next";
import i18nNextICU from "i18next-icu";
import { MessageCollector, MessageCollectorOptions } from "./Util/MessageCollector";
import { MangaCordManager } from "./Manager";
import localeEN from "./Locales/en.json";
import localeID from "./Locales/id.json";

type AvailableLocale = "en" | "id";

interface InitClientOptions {
    presence?: {
        status: Status;
        activities?: ActivityPartial<BotActivityType> | ActivityPartial<BotActivityType>[];
    }
}

export class MangaCordClient extends Client {

    /**
     * Collection of commands
     */
    public commands: Collection<Command> = new Collection<Command>();

    /**
     * The bot's configuration value
     */
    public config: Config;

    /**
     * MongoDB database connection
     */
    public database: Connection;

    /**
     * Collection of gateway events
     */
    public events: Collection<Event> = new Collection<Event>();

    /**
     * Logger
     */
    public logger: Logger = new Logger();

    /**
     * The client's manager to manage stuff
     */
    public manager: MangaCordManager = new MangaCordManager(this);

    /**
     * Collect messages in a channel
     * @param channel The text-channel to collect messages
     * @param options Message collector options
     * @returns {Promise<MessageCollector>}
     */
    public awaitChannelMessages(channel: TextableChannel, options: MessageCollectorOptions): Promise<MessageCollector> {
        return new MessageCollector(channel, options).run();
    }

    /**
     * Initialise everything
     */
    public initAllEvents(): void {
        this.initCommands();
        this.initErrorEvent();
        this.initDebugEvent();
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

    /**
     * Initialise MangaCord extended client
     * @param options Client options
     */
    public initClient(options: InitClientOptions): void {
        this.connect();
        this.database = new MangaCordDatabase(`mongodb+srv://${this.config.MONGODB.HOST}/${this.config.MONGODB.NAME}`).connect();

        if (options.presence) {
            this.editStatus(options.presence.status, options.presence.activities);
        }
    }

    /**
     * Load all commands
     */
    public initCommands(): void {
        const commandPath = join(__dirname, "..", "..", "bot", "src", "Commands");

        readdirSync(commandPath).forEach(async (dir) => {
            const commands = readdirSync(`${commandPath}/${dir}`).filter((file) => file.endsWith(".ts"));

            for (const file of commands) {
                const { command } = await import(`${commandPath}/${dir}/${file}`);

                this.commands.set(command.name, command);
            }
        });

    }

    /**
     * Load `error` event
     */
    public async initErrorEvent(): Promise<void> {
        const path = join(__dirname, "Events", "Error.js");
        const { event } = await import(path);

        this.events.set(event.name, event);
        this.on(event.name, event.run.bind(null, this));
    }

    public async initDebugEvent(): Promise<void> {
        const path = join(__dirname, "Events", "Debug.js");
        const { event } = await import(path);

        this.events.set(event.name, event);
        this.on(event.name, event.run.bind(null, this));
    }

    /**
     * Load `guildCreate` event
     */
    public async initGuildCreateEvent(): Promise<void> {
        const path = join(__dirname, "Events", "GuildCreate.js");
        const { event } = await import(path);

        this.events.set(event.name, event);
        this.on(event.name, event.run.bind(null, this));
    }

    /**
     * Load all available locales
     * @param locale The available language to use
     * @returns {Promise<TFunction>}
     */
    public initLocale(locale: AvailableLocale): Promise<TFunction> {
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

    /**
     * Load `messageCreate` event
     */
    public async initMessageCreateEvent(): Promise<void> {
        const path = join(__dirname, "Events", "MessageCreate.js");
        const { event } = await import(path);

        this.events.set(event.name, event);
        this.on(event.name, event.run.bind(null, this));
    }

    /**
     * Load `ready` event
     */
    public async initReadyEvent(): Promise<void> {
        const path = join(__dirname, "Events", "Ready.js");
        const { event } = await import(path);

        this.events.set(event.name, event);
        this.on(event.name, event.run.bind(null, this));
    }

    /**
     * Load `shardPreReady` event
     */
    public async initShardReadyEvent(): Promise<void> {
        const path = join(__dirname, "Events", "ShardPreReady.js");
        const { event } = await import(path);

        this.events.set(event.name, event);
        this.on(event.name, event.run.bind(null, this));
    }

    /**
     * Translate keys
     * @param key The translation key
     * @param variable Set the variable's value
     */
    public translate(key: string | string[], variable?: object): string;

    /**
     * Translate keys based on requested locale
     * @param locale The requested locale
     * @param key The translation key
     * @param variable Set the variables' value
     * @returns {String}
     */
    /* @ts-ignore */
    public translateLocale(locale: AvailableLocale, key: string | string[], variable?: object): string {
        this.initLocale(locale);

        return t(key, variable);
    }
}
