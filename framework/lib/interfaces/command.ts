import { MangaCordClient } from "../client";
import { Message, TextableChannel } from "eris";

interface CommandRunPayload {
    client: MangaCordClient;
    message: Message<TextableChannel>;
    args: Array<string>;
}

interface CommandRun {
    (payload: CommandRunPayload);
}

export interface Command {
    adminOnly?: boolean;
    category?: string;
    description?: string;
    name: string;
    run: CommandRun;
}
