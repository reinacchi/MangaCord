import { MangaCordClient } from "../../Client";
import { Message, MessageReferenceReply, TextableChannel } from "eris";
import { RichEmbed } from "../../Util";

export async function pingCommand(client: MangaCordClient, message: Message<TextableChannel>) {
    const embed = new RichEmbed()
        .setColor(0xED9A00)
        .setDescription(await client.translate("general.ping", { latency: `${message.member.guild.shard.latency}ms` }));

    const messageReference: MessageReferenceReply = {
        messageID: message.id
    };

    return message.channel.createMessage({
        embed,
        messageReference
    });
}
