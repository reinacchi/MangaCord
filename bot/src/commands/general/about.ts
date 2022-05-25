import { MangaCordCommand, MangaCordInterfaces } from "MangaCord-framework";

export const command: MangaCordInterfaces.Command = {
    name: "about",
    run: async ({ client, message }) => {
        return MangaCordCommand.aboutCommand(client, message);
    }
};
