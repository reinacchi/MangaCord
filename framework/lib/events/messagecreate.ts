import { Event } from "../interfaces";
import { Logger } from "../util";
import { Message, TextableChannel } from "eris";
import { GuildModel } from "../models";

export const event: Event = {
    name: "messageCreate",
    run: async (client, message: Message<TextableChannel>) => {
        const model = GuildModel.createModel(client.database);
        const guildData = await model.findOne({ id: message.guildID });

        if (!message.content.startsWith(guildData.settings.prefix) || message.author.bot) return;

        const messageArray = message.content.split(" ");
        const args = messageArray.slice(1);
        const commandName = messageArray[0].slice(client.config.BOT.PREFIX.length);
        const command = client.commands.get(commandName);
        const logger = new Logger();

        if (!command) return;

        if (command.adminOnly && !client.config.BOT.ADMIN.includes(message.author.id)) return;

        if (command) {
            logger.info({ message: `${message.author.username}#${message.author.discriminator} (${message.author.id}) Runs "${command.name}" In ${message.member.guild.name} (${message.guildID})`, subTitle: "MangaCordFramework::MessageHandler", title: "COMMANDS", type: "INFO" });
            return command.run({ args, client, message });
        }
    }
};
