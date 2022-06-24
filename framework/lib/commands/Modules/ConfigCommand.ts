import { MangaCordClient } from "../../Client";
import { Message, MessageReferenceReply, TextableChannel } from "eris";
import { GuildModel } from "../../Models";
import { RichEmbed } from "../../Util";
import yargs from "yargs/yargs";

type Locale = "en" | "id";
type Setting = "locale";

export async function configCommand(client: MangaCordClient, message: Message<TextableChannel>, args: string[]) {
    const embed = new RichEmbed()
        .setColor(0xED9A00);

    const flag = await yargs(args.slice(0)).array(["setting", "value"]).argv;
    const messageReference: MessageReferenceReply = {
        messageID: message.id
    };

    if (!message.member.permissions.has("manageGuild")) {
        return message.channel.createMessage({
            embed: embed.setDescription(await client.translate("admin.config.perms")),
            messageReference
        });
    }

    if (flag.setting) {
        switch (flag.setting[0] as Setting) {
            case "locale":
                if (flag.value) {
                    const guildModel = GuildModel.createModel(client.database);

                    guildModel.updateOne({ id: message.guildID }, { $set: { "settings.locale": flag.value[0] } }).exec();
                }

                message.channel.createMessage({
                    embed: embed.setDescription(await client.translateLocale(flag.value[0] as Locale, "admin.config.success.lang", { locale: `\`${convertLocaleKey(flag.value[0] as Locale)}\`` })),
                    messageReference
                });
                break;
        }
    }
}

function convertLocaleKey(locale: Locale) {
    switch (locale) {
        case "en":
            return "English";
        case "id":
            return "Indonesia";
        default:
            return "Unknown";
    }
}
