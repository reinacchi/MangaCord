import { MangaCordClient } from "../../Client";
import { Message, MessageReferenceReply, TextableChannel } from "eris";
import { RichEmbed } from "../../Util";

/**
 * Sends `about` command
 * @param client MangaCord client
 * @param message Eris message
 * @returns {Promise<Message<TextableChannel>>}
 */
export async function aboutCommand(client: MangaCordClient, message: Message<TextableChannel>): Promise<Message<TextableChannel>> {
    const embed = new RichEmbed()
        .setAuthor(client.user.username)
        .setColour(0xED9A00)
        .setDescription(client.translate("general.about.description"))
        .setTitle(client.translate("general.about.title"));

    const messageReference: MessageReferenceReply = {
        messageID: message.id
    };

    return message.channel.createMessage({
        embed,
        messageReference
    });
}
