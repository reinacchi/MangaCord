import { MangaCordCommand, MangaCordInterfaces } from "mangacord-framework";

export const command: MangaCordInterfaces.Command = {
    name: "search",
    run: async (payload) => {
        return new MangaCordCommand(payload).searchMangaCommand();
    }
}