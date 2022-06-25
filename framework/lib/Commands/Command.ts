import { CommandRunPayload } from "../Interfaces";
import { MangaCordClient } from "../Client";
import { Message, TextableChannel } from "eris";
import * as CommandModules from "./Modules";

export class MangaCordCommand {
    private client: MangaCordClient;

    private message: Message<TextableChannel>;

    private args: string[];

    /**
     * Load all command modules
     * @param payload The data payload
     */
    constructor(payload: CommandRunPayload) {
        this.args = payload.args;
        this.client = payload.client;
        this.message = payload.message;
    }

    /**
     * About Command
     * @returns {Promise<Message<TextableChannel>>}
     */
    public aboutCommand(): Promise<Message<TextableChannel>> {
        return CommandModules.aboutCommand(this.client, this.message);
    }

    /**
     * Config Command
     * @returns {Promise<Message<TextableChannel>>}
     */
    public configCommand(): Promise<Message<TextableChannel>> {
        return CommandModules.configCommand(this.client, this.message, this.args);
    }

    /**
     * Ping Command
     * @returns {Promise<Message<TextableChannel>>}
     */
    public pingCommand(): Promise<Message<TextableChannel>> {
        return CommandModules.pingCommand(this.client, this.message);
    }

    /**
     * Read Manga Command
     * @returns {Promise<Message<TextableChannel>>}
     */
    public readMangaCommand(): Promise<Message<TextableChannel>> {
        return CommandModules.readMangaCommand(this.client, this.message, this.args);
    }

    /**
     * Search Manga Command
     * @returns {Promise<Message<TextableChannel>>}
     */
    public searchMangaCommand(): Promise<Message<TextableChannel>> {
        return CommandModules.readMangaCommand(this.client, this.message, this.args);
    }
}
