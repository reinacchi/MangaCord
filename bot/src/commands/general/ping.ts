import { MangaCordCommand, MangaCordInterfaces } from "MangaCord-framework";

export const command: MangaCordInterfaces.Command = {
    name: "ping",
    run: async ({ client, message }) => {
        return MangaCordCommand.pingCommand(client, message);
    }
};
