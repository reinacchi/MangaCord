import { MangaCordClient } from "../Client";
import { Message, TextableChannel } from "eris";

export interface CommandRunPayload {
    client: MangaCordClient;
    message: Message<TextableChannel>;
    args: Array<string>;
}

export interface CommandRun {
    (payload: CommandRunPayload);
}

export interface Command {
    adminOnly?: boolean;
    category?: string;
    description?: string;
    name: string;
    run: CommandRun;
}
