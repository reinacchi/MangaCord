import { MangaCordCommand, MangaCordInterfaces } from "mangacord-framework";

export const command: MangaCordInterfaces.Command = {
    name: "read",
    run: async (payload) => {
        return new MangaCordCommand(payload).readMangaCommand();
    }
};
