import { MangaCordCommand, MangaCordInterfaces } from "mangacord-framework";

export const command: MangaCordInterfaces.Command = {
    name: "config",
    run: async (payload) => {
        return new MangaCordCommand(payload).configCommand();
    }
}