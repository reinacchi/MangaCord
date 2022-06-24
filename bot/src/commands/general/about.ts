import { MangaCordCommand, MangaCordInterfaces } from "MangaCord-framework";

export const command: MangaCordInterfaces.Command = {
    name: "about",
    run: async (payload) => {
        return new MangaCordCommand(payload).aboutCommand();
    }
};
