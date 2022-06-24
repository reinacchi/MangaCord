import { ActionRow, Message, MessageReferenceReply, TextableChannel } from "eris";
import { MangaCordClient } from "../../Client";
import { Manga } from "mangadex-full-api";
import { RichEmbed } from "../../Util";
import { createMangaRead } from "../../Modules/ReadMangaPaginator";
import moment from "moment";
import yargs from "yargs/yargs";

export async function readMangaCommand(client: MangaCordClient, message: Message<TextableChannel>, args: string[]) {
    const flag = await yargs(args.slice(0)).array(["manga", "chapter"]).argv;
    const manga = await Manga.getByQuery(flag.manga.join(" "));
    const chapters = await manga.getFeed({ limit: Infinity, order: { chapter: "asc" }, translatedLanguage: ["en"] });
    const chapter = (flag.chapter && flag.chapter.length !== 0) ? chapters.find((ch) => ch.chapter === flag.chapter[0].toString()) : chapters[0];
    const cover = await manga.getCovers();
    const author = (await manga.authors[0].resolve()).name; // await manga.authors.map(async (a) => await (await a.resolve()).name).join(", ");
    const artist = (await manga.artists[0].resolve()).name; // await manga.artists.map(async (a) => await (await a.resolve()).name).join(", ");
    const genre = manga.tags.filter((t) => t.group === "genre").map((t) => t.name).join("`, `");
    const theme = manga.tags.filter((t) => t.group === "theme").map((t) => t.name).join("`, `");
    const payload = { chapter, chapters, manga };
    const components: ActionRow[] = [
        {
            components: [
                {
                    custom_id: `oldch_${message.id}`,
                    label: "First Chapter",
                    style: 1,
                    type: 2
                },
                {
                    custom_id: `prevch_${message.id}`,
                    label: "Previous Chapter",
                    style: 2,
                    type: 2
                },
                {
                    custom_id: `read_${message.id}`,
                    label: "Read",
                    style: 3,
                    type: 2
                },
                {
                    custom_id: `nextch_${message.id}`,
                    label: "Next Chapter",
                    style: 2,
                    type: 2
                },
                {
                    custom_id: `newch_${message.id}`,
                    label: "Latest Chapter",
                    style: 1,
                    type: 2
                },
            ],
            type: 1
        },
        {
            components: [
                {
                    custom_id: `inputch_${message.id}`,
                    label: "Enter Chapter",
                    style: 2,
                    type: 2
                },
                {
                    custom_id: `bookmark_${message.id}`,
                    label: "Bookmark",
                    style: 1,
                    type: 2
                },
                {
                    custom_id: `dismiss_${message.id}`,
                    label: "Dismiss",
                    style: 4,
                    type: 2
                }
            ],
            type: 1
        }
    ];
    const messageReference: MessageReferenceReply = {
        messageID: message.id
    };

    const embed = new RichEmbed()
        .setAuthor(chapter.title !== null && chapter.title.length !== 0 ? `${chapter.title} | Ch. ${chapter.chapter}` : `Ch. ${chapter.chapter}`, `https://mangadex.org/chapter/${chapter.id}`)
        .setURL(`https://mangadex.org/title/${manga.id}`)
        .setColor(0xED9A00)
        .setDescription(manga.description)
        .addField(manga.authors.length === 1 ? "Author" : "Authors", `\`${author}\``)
        .addField(manga.artists.length === 1 ? "Artist" : "Artists", `\`${artist}\``)
        .addField("Published At", `\`${moment(chapter.publishAt).format("On dddd, MMMM Do, YYYY h:mm A")}\``)
        .addField("Genres", `\`${genre || "None"}\``)
        .addField("Themes", `\`${theme || "None"}\``)
        .addField("Status", `Publication: **${manga.year || "Unknown"}**, ${manga.status.charAt(0).toUpperCase() + manga.status.slice(1)}`)
        .setThumbnail(cover[0].image512)
        .setTitle(manga.title);

    const msg = await message.channel.createMessage({
        components,
        embed,
        messageReference
    });

    return createMangaRead(client, payload, msg, message);
}
