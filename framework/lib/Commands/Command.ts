import { CommandRunPayload } from "../Interfaces";
import { MangaCordClient } from "../Client";
import { Message, TextableChannel } from "eris";
import * as CommandModules from "./Modules";

export class MangaCordCommand {
    private client: MangaCordClient;

    private message: Message<TextableChannel>;

    private args: string[];

    constructor(payload: CommandRunPayload) {
        this.args = payload.args;
        this.client = payload.client;
        this.message = payload.message;
    }

    public aboutCommand() {
        return CommandModules.aboutCommand(this.client, this.message);
    }

    public configCommand() {
        return CommandModules.configCommand(this.client, this.message, this.args);
    }

    public pingCommand() {
        return CommandModules.pingCommand(this.client, this.message);
    }

    public readMangaCommand() {
        return CommandModules.readMangaCommand(this.client, this.message, this.args);
    }

    public searchMangaCommand() {
        return CommandModules.readMangaCommand(this.client, this.message, this.args);
    }
}
