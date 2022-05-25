import { Event } from "../interfaces";
import { Logger } from "../util";
import { MangaCordMongoModels } from "../commands";
import { Message, TextableChannel } from "eris";
import { GuildModel, UserModel } from "../models";

export const event: Event = {
    name: "messageCreate",
    run: async (client, message: Message<TextableChannel>) => {
        const guildModel = GuildModel.createModel(client.database);
        const userModel = UserModel.createUserModel(client.database);
        const guildData = await guildModel.findOne({ id: message.guildID });
        const userData = await userModel.findOne({ id: message.author.id });

        if (!message.content.startsWith(guildData.settings.prefix) || message.author.bot) return;

        if (!userData) {
            message.channel.createMessage({
                content: "Is this your first time using the bot? If yes, I have created a database to store your necessary data for me to work. Please enjoy!",
                messageReference: {
                    messageID: message.id
                }
            });

            return MangaCordMongoModels.createUserModel(client.database, {
                admin: false,
                createdAt: new Date(),
                id: message.author.id,
                manga: {
                    bookmarks: []
                },
                premium: false
            });
        }

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
