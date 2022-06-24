import { MangaCordCommand, MangaCordInterfaces } from "MangaCord-framework";

export const command: MangaCordInterfaces.Command = {
    name: "ping",
    run: async (payload) => {
        return new MangaCordCommand(payload).pingCommand();
    }
};
