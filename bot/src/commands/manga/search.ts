import { MangaCordCommand, MangaCordInterfaces } from "mangacord-framework";

export const command: MangaCordInterfaces.Command = {
    name: "search",
    run: async ({ client, message, args }) => {
        return MangaCordCommand.searchMangaCommand(client, message, args);
    }
}