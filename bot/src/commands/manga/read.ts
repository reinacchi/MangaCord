import { MangaCordCommand, MangaCordInterfaces } from "mangacord-framework";

export const command: MangaCordInterfaces.Command = {
    name: "read",
    run: async ({ client, message, args }) => {
        MangaCordCommand.readMangaCommand(client, message, args);
    }
};
