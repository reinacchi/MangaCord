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
        .setAuthor(mangaResults.length === 1 ? "Result 1/1" : `Results 1/${mangaResults.length}`)
        .setURL(`https://mangadex.org/title/${manga.id}`)
        .setColor(0xED9A00)
        .setDescription(manga.description)
        .addField(manga.authors.length === 1 ? "Author" : "Authors", `\`${author}\``)
        .addField(manga.artists.length === 1 ? "Artist" : "Artists", `\`${artist}\``)
        .addField("Chapters", `\`${chapters.length}\``)
        .addField("Genres", `\`${genre || "None"}\``)
        .addField("Themes", `\`${theme || "None"}\``)
        .addField("Status", `Publication: **${manga.year || "Unknown"}**, ${manga.status.charAt(0).toUpperCase() + manga.status.slice(1)}`)
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
