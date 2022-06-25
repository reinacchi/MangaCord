import { MangaCordClient } from "../../Client";
import { Manga } from "mangadex-full-api";
import { Message, MessageReferenceReply, TextableChannel } from "eris";
import { RichEmbed } from "../../Util";

export async function searchMangaCommand(client: MangaCordClient, message: Message<TextableChannel>, args: string[]) {
    const query = args.slice(0).join(" ");
    const mangaResults = await Manga.search({ title: query });
    const manga = mangaResults[0];
    const chapters = await manga.getFeed({ limit: Infinity, order: { chapter: "asc" }, translatedLanguage: ["en"] });
    const cover = await manga.getCovers();
    const author = (await manga.authors[0].resolve()).name; // await manga.authors.map(async (a) => await (await a.resolve()).name).join(", ");
    const artist = (await manga.artists[0].resolve()).name; // await manga.artists.map(async (a) => await (await a.resolve()).name).join(", ");
    const genre = manga.tags.filter((t) => t.group === "genre").map((t) => t.name).join("`, `");
    const theme = manga.tags.filter((t) => t.group === "theme").map((t) => t.name).join("`, `");

    const embed = new RichEmbed()
        .setAuthor(mangaResults.length === 1 ? client.translate("manga.result", { firstIndex: 1, lastIndex: 2 }) : client.translate("manga.result", { firstIndex: 1, lastIndex: mangaResults.length } ))
        .setURL(`https://mangadex.org/title/${manga.id}`)
        .setColor(0xED9A00)
        .setDescription(manga.description)
        .addField(manga.authors.length === 1 ? client.translate("manga.author") : client.translate("manga.authors"), `\`${author}\``)
        .addField(manga.artists.length === 1 ? client.translate("manga.artist") : client.translate("manga.artists"), `\`${artist}\``)
        .addField(client.translate("manga.chapters"), `\`${chapters.length}\``)
        .addField(client.translate("manga.genres"), `\`${genre || client.translate("manga.none")}\``)
        .addField(client.translate("manga.themes"), `\`${theme || client.translate("manga.none")}\``)
        .addField(client.translate("manga.status"), client.translate("manga.status.publication", { status: manga.status.charAt(0).toUpperCase() + manga.status.slice(1), year: manga.year || client.translate("manga.unknown") }))
        .setThumbnail(cover[0].image512)
        .setTitle(manga.title);

    const messageReference: MessageReferenceReply = {
        messageID: message.id
    };

    return message.channel.createMessage({
        embed,
        messageReference
    });
}
