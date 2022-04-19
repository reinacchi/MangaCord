import { ClientEvents } from "eris";
import { MangaCordClient } from "../client";

interface EventRun {
    (client: MangaCordClient, ...args: any);
}

export interface Event {
    name: keyof ClientEvents;
    run: EventRun;
}
