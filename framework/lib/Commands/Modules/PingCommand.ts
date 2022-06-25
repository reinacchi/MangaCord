import { MangaCordClient } from "../../Client";
import { Message, MessageReferenceReply, TextableChannel } from "eris";
import { RichEmbed } from "../../Util";

/**
 * Sends `ping` command
 * @param client MangaCord client
 * @param message Eris message
 * @returns {Promise<Message<TextableChannel>>}
 */
export async function pingCommand(client: MangaCordClient, message: Message<TextableChannel>): Promise<Message<TextableChannel>> {
    const embed = new RichEmbed()
        .setColour(0xED9A00)
        .setDescription(client.translate("general.ping", { latency: `${message.member.guild.shard.latency}ms` }));

    const messageReference: MessageReferenceReply = {
        messageID: message.id
    };

    return message.channel.createMessage({
        embed,
        messageReference
    });
}
