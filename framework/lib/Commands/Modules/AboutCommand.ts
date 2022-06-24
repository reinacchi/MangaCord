import { MangaCordClient } from "../../Client";
import { Message, MessageReferenceReply, TextableChannel } from "eris";
import { RichEmbed } from "../../Util";

export async function aboutCommand(client: MangaCordClient, message: Message<TextableChannel>) {
    const embed = new RichEmbed()
        .setAuthor(client.user.username)
        .setColor(0xED9A00)
        .setDescription(await client.translate("general.about.description"))
        .setTitle(await client.translate("general.about.title"));

    const messageReference: MessageReferenceReply = {
        messageID: message.id
    };

    return message.channel.createMessage({
        embed,
        messageReference
    });
}
