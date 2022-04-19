import { MangaCordCommand, MangaCordInterfaces } from "MangaCord-framework";

export const command: MangaCordInterfaces.Command = {
    name: "about",
    run: async ({ client, message }) => {
        MangaCordCommand.aboutCommand(client, message);
    }
};
