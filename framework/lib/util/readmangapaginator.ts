import { AdvancedMessageContent, ComponentInteraction, EmbedOptions, Message, TextableChannel } from "eris";
import { Chapter, Manga } from "mangadex-full-api";
import { MangaCordClient } from "../client";
import { RichEmbed } from "./richembed";
import moment from "moment";

interface MangaReadPayload {
    chapter: Chapter;
    chapters: Chapter[];
    manga: Manga;
}

class MangaReadPaginator {
    authorMessage: Message<TextableChannel>;

    chapter: Chapter;

    chapters: Chapter[];

    client: MangaCordClient;

    embeds: EmbedOptions[];

    embed: number;

    invoker: Message<TextableChannel>;

    manga: Manga;

    mangaEmbed: number;

    mangaEmbeds: EmbedOptions[];

    message: Message<TextableChannel>;

    pages: string[];

    constructor(client: MangaCordClient, payload: MangaReadPayload, message: Message<TextableChannel>, authorMessage?: Message<TextableChannel>) {
        this.authorMessage = authorMessage;
        this.chapter = payload.chapter;
        this.chapters = payload.chapters;
        this.client = client;
        this.embed = 1;
        this.invoker = message;
        this.manga = payload.manga;
        this.mangaEmbed = this.chapters.map((ch) => ch.chapter).indexOf(this.chapter.chapter);
    }

    async initChapter(): Promise<void> {
        const mangaCover = await this.manga.getCovers();
        const mangaAuthor = (await this.manga.authors[0].resolve()).name;
        const mangaArtist = (await this.manga.artists[0].resolve()).name;
        const genre = this.manga.tags.filter((t) => t.group === "genre").map((tag) => tag.name).join("`, `");
        const theme = this.manga.tags.filter((t) => t.group === "theme").map((tag) => tag.name).join("`, `");

        this.mangaEmbeds = this.chapters.map((ch) => {
            return new RichEmbed()
                .setAuthor(ch.title !== null && ch.title.length !== 0 ? `${ch.title} | Ch. ${ch.chapter}` : `Ch. ${ch.chapter}`, `https://mangadex.org/chapter/${ch.id}`)
                .setTitle(this.manga.title)
                .setURL(`https://mangadex.org/title/${this.manga.id}`)
                .setColor(this.authorMessage.member.guild.roles.get(this.authorMessage.member.guild.members.get(this.client.user.id).roles[0]).color)
                .setDescription(this.manga.description)
                .addField(this.manga.authors.length === 1 ? "Author" : "Authors", `\`${mangaAuthor}\``)
                .addField(this.manga.artists.length === 1 ? "Artist" : "Artists", `\`${mangaArtist}\``)
                .addField("Published At", `\`${moment(ch.publishAt).format("On dddd, MMMM Do, YYYY h:mm A")}\``)
                .addField("Genres", `\`${(genre || "None")}\``)
                .addField("Themes", `\`${(theme || "None")}\``)
                .addField("Status", `Publication: **${this.manga.year || "Unknown"}**, ${this.manga.status.charAt(0).toUpperCase() + this.manga.status.slice(1)}`)
                .setThumbnail(mangaCover[0].image512);
        });

        this.mangaEmbed = this.chapters.map((ch) => ch.chapter).indexOf(this.chapter.chapter);
    }

    async init(): Promise<void> {
        this.pages = await this.chapter.getReadablePages();
        this.embeds = this.pages.map((page, index) => {
            return new RichEmbed()
                .setAuthor(this.manga.title, `https://mangadex.org/title/${this.manga.id}`)
                .setTitle( this.chapter.title !== null && this.chapter.title.length !== 0 ? `${this.chapter.title} | Ch. ${this.chapter.chapter}` : `Ch. ${this.chapter.chapter}`)
                .setURL(`https://mangadex.org/chapter/${this.chapter.id}`)
                .setColor(this.authorMessage.member.guild.roles.get(this.authorMessage.member.guild.members.get(this.client.user.id).roles[0]).color)
                .setImage(page)
                .setFooter(`Page ${index + 1} / ${this.pages.length}`);
        });

        const messageContent: AdvancedMessageContent = {
            components: [
                {
                    components: [
                        { custom_id: `firstpg_${this.invoker.id}`, label: "First Page", style: 1, type: 2 },
                        { custom_id: `backpg_${this.invoker.id}`, label: "Previous Page", style: 2, type: 2 },
                        { custom_id: `dismiss_${this.authorMessage.id}`, label: "Dismiss", style: 4, type: 2 },
                        { custom_id: `nextpg_${this.invoker.id}`, label: "Next Page", style: 2, type: 2 },
                        { custom_id: `lastpg_${this.invoker.id}`, label: "Last Page", style: 1, type: 2 }
                    ],
                    type: 1
                },
                {
                    components: [
                        { custom_id: `inputpg_${this.invoker.id}`, label: "Enter Page", style: 2, type: 2 },
                        { custom_id: `home_${this.invoker.id}`, label: "Home", style: 1, type: 2 }
                    ],
                    type: 1
                }
            ],
            embed: this.embeds[this.embed - 1]
        };

        if (this.invoker.author.id === this.invoker.channel.client.user.id) {
            this.message = await this.invoker.edit(messageContent);
        }
    }

    updateChapter(): void {
        this.invoker.edit({
            components: [
                {
                    components: [
                        {
                            custom_id: `oldch_${this.authorMessage.id}`,
                            label: "First Chapter",
                            style: 1,
                            type: 2
                        },
                        {
                            custom_id: `prevch_${this.authorMessage.id}`,
                            label: "Previous Chapter",
                            style: 2,
                            type: 2
                        },
                        {
                            custom_id: `read_${this.authorMessage.id}`,
                            label: "Read",
                            style: 3,
                            type: 2
                        },
                        {
                            custom_id: `nextch_${this.authorMessage.id}`,
                            label: "Next Chapter",
                            style: 2,
                            type: 2
                        },
                        {
                            custom_id: `newch_${this.authorMessage.id}`,
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
                            custom_id: `inputch_${this.authorMessage.id}`,
                            label: "Enter Chapter",
                            style: 2,
                            type: 2
                        },
                        {
                            custom_id: `bookmark_${this.authorMessage.id}`,
                            label: "Bookmark",
                            style: 1,
                            type: 2
                        },
                        {
                            custom_id: `dismiss_${this.authorMessage.id}`,
                            label: "Dismiss",
                            style: 4,
                            type: 2
                        }
                    ],
                    type: 1
                }
            ],
            embed: this.mangaEmbeds[this.mangaEmbed]
        });

        this.chapter = this.chapters[this.mangaEmbed];
    }

    updatePage(): void {
        this.message.edit({
            components: [
                {
                    components: [
                        { custom_id: `firstpg_${this.invoker.id}`, label: "First Page", style: 1, type: 2 },
                        { custom_id: `backpg_${this.invoker.id}`, label: "Previous Page", style: 2, type: 2 },
                        { custom_id: `dismiss_${this.authorMessage.id}`, label: "Dismiss", style: 4, type: 2 },
                        { custom_id: `nextpg_${this.invoker.id}`, label: "Next Page", style: 2, type: 2 },
                        { custom_id: `lastpg_${this.invoker.id}`, label: "Last Page", style: 1, type: 2 }
                    ],
                    type: 1
                },
                {
                    components: [
                        { custom_id: `inputpg_${this.invoker.id}`, label: "Enter Page", style: 2, type: 2 },
                        { custom_id: `home_${this.invoker.id}`, label: "Home", style: 1, type: 2 }
                    ],
                    type: 1
                }
            ],
            embed: this.embeds[this.embed - 1]
        });
    }

    async run(): Promise<void> {
        this.client.on("interactionCreate", async (interaction: ComponentInteraction<TextableChannel>) => {
            if (interaction.member.bot) return;

            switch (interaction.data.custom_id) {
                case `read_${this.authorMessage.id}`:
                    interaction.acknowledge();
                    this.init();
                    break;
                case `nextpg_${this.invoker.id}`:
                    interaction.acknowledge();

                    if (this.embed < this.embeds.length) {
                        this.embed++;
                        this.updatePage();
                    }

                    break;
                case `backpg_${this.invoker.id}`:
                    interaction.acknowledge();

                    if (this.embed > 1) {
                        this.embed--;
                        this.updatePage();
                    }

                    break;
                case `home_${this.invoker.id}`:
                    interaction.acknowledge();

                    this.embed = 1;
                    this.updateChapter();

                    break;
                case `bookmark_${this.authorMessage.id}`:
                    await this.client.manager.saveManga(this.authorMessage.author.id, this.manga);

                    interaction.createMessage({
                        embeds: [
                            new RichEmbed()
                                .setDescription(`Manga \`${this.manga.title}\` Successfully saved to your bookmark library!`)
                                .setColor(this.authorMessage.member.guild.roles.get(this.authorMessage.member.guild.members.get(this.client.user.id).roles[0]).color)
                        ],
                        flags: 64
                    });

                    break;
                case `dismiss_${this.authorMessage.id}`:
                    interaction.acknowledge();
                    interaction.message.delete();
                    this.authorMessage.delete();
                    break;
                case `firstpg_${this.invoker.id}`:
                    interaction.acknowledge();

                    this.embed = 1;
                    this.updatePage();
                    break;
                case `lastpg_${this.invoker.id}`:
                    interaction.acknowledge();

                    this.embed = this.embeds.length;
                    this.updatePage();
                    break;
                case `nextch_${this.authorMessage.id}`:
                    interaction.acknowledge();

                    if (this.mangaEmbed < this.mangaEmbeds.length - 1) {
                        this.mangaEmbed++;
                        this.updateChapter();
                    }

                    break;
                case `prevch_${this.authorMessage.id}`:
                    interaction.acknowledge();

                    if (this.mangaEmbed >= 1) {
                        this.mangaEmbed--;
                        this.updateChapter();
                    }

                    break;
                case `oldch_${this.authorMessage.id}`:
                    interaction.acknowledge();

                    this.mangaEmbed = 0;
                    this.updateChapter();
                    break;
                case `newch_${this.authorMessage.id}`:
                    interaction.acknowledge();

                    this.mangaEmbed = this.mangaEmbeds.length - 1;
                    this.updateChapter();
                    break;
                case `inputch_${this.authorMessage.id}`:
                    interaction.createMessage({
                        embeds: [
                            new RichEmbed()
                                .setDescription("Please enter the chapter you want to see. You've got **30 seconds** before I ignore you")
                                .setColor(this.authorMessage.member.guild.roles.get(this.authorMessage.member.guild.members.get(this.client.user.id).roles[0]).color)
                        ],
                        flags: 64
                    });

                    /* eslint-disable-next-line */
                    const filter = (m: Message<TextableChannel>) => {
                        if (m.author.bot) return;
                        if (m.author.id !== interaction.member.id) return;

                        if (isNaN(parseInt(m.content))) {
                            m.delete();
                            interaction.createMessage({
                                embeds: [
                                    new RichEmbed()
                                        .setDescription("Please enter a valid chapter")
                                        .setColor(this.authorMessage.member.guild.roles.get(this.authorMessage.member.guild.members.get(this.client.user.id).roles[0]).color)
                                ],
                                flags: 64
                            });

                            return false;
                        }

                        if (!this.chapters.find((ch) => ch.chapter === m.content)) {
                            m.delete();
                            interaction.createMessage({
                                embeds: [
                                    new RichEmbed()
                                        .setDescription(`Cannot find chapter **${m.content}**. Please provide a valid chapter`)
                                        .setColor(this.authorMessage.member.guild.roles.get(this.authorMessage.member.guild.members.get(this.client.user.id).roles[0]).color)
                                ],
                                flags: 64
                            });
                        }
                        else return true;
                    };

                    /* eslint-disable-next-line */
                    const response = await this.client.awaitChannelMessages(interaction.channel, { count: 1, filter, timeout: 1000 * 30 });

                    if (response.message) {
                        response.message.delete();
                        this.mangaEmbed = this.chapters.map((ch) => ch.chapter).indexOf(response.message.content);
                        this.updateChapter();
                    } else {
                        return interaction.createMessage({
                            embeds: [
                                new RichEmbed()
                                    .setDescription("**30 seconds** passed and I've not received any response from you...")
                                    .setColor(this.authorMessage.member.guild.roles.get(this.authorMessage.member.guild.members.get(this.client.user.id).roles[0]).color)
                            ],
                            flags: 64
                        });
                    }

                    break;
                case `inputpg_${this.invoker.id}`:
                    interaction.createMessage({
                        embeds: [
                            new RichEmbed()
                                .setDescription(`This manga has a total pages of **${this.pages.length}**. Please enter the chapter you want to see. You've got **30 seconds** before I ignore you`)
                                .setColor(this.authorMessage.member.guild.roles.get(this.authorMessage.member.guild.members.get(this.client.user.id).roles[0]).color)
                        ],
                        flags: 64
                    });

                    /* eslint-disable-next-line */
                    const filterPG = (m: Message<TextableChannel>) => {
                        if (m.author.bot) return;
                        if (m.author.id !== interaction.member.id) return;

                        if (isNaN(parseInt(m.content))) {
                            m.delete();
                            interaction.createMessage({
                                embeds: [
                                    new RichEmbed()
                                        .setDescription("Please enter a valid page")
                                        .setColor(this.authorMessage.member.guild.roles.get(this.authorMessage.member.guild.members.get(this.client.user.id).roles[0]).color)
                                ],
                                flags: 64
                            });

                            return false;
                        }

                        if (parseInt(m.content) <= 0) {
                            m.delete();
                            interaction.createMessage({
                                embeds: [
                                    new RichEmbed()
                                        .setDescription(`This manga only has **1-${this.pages.length}** pages. Please enter a valid page`)
                                        .setColor(this.authorMessage.member.guild.roles.get(this.authorMessage.member.guild.members.get(this.client.user.id).roles[0]).color)
                                ],
                                flags: 64
                            });
                        }

                        if (parseInt(m.content) > this.pages.length) {
                            m.delete();
                            interaction.createMessage({
                                embeds: [
                                    new RichEmbed()
                                        .setDescription(`This manga only has **1-${this.pages.length}** pages. Please enter a valid page`)
                                        .setColor(this.authorMessage.member.guild.roles.get(this.authorMessage.member.guild.members.get(this.client.user.id).roles[0]).color)
                                ],
                                flags: 64
                            });
                        }
                        else return true;
                    };

                    /* eslint-disable-next-line */
                    const responsePG = await this.client.awaitChannelMessages(interaction.channel, { count: 1, filter: filterPG, timeout: 1000 * 30 });

                    if (responsePG.message) {
                        responsePG.message.delete();
                        this.embed = parseInt(responsePG.message.content);
                        this.updatePage();
                    } else {
                        return interaction.createMessage({
                            embeds: [
                                new RichEmbed()
                                    .setDescription("**30 seconds** passed and I've not received any response from you...")
                                    .setColor(this.authorMessage.member.guild.roles.get(this.authorMessage.member.guild.members.get(this.client.user.id).roles[0]).color)
                            ],
                            flags: 64
                        });
                    }

                    break;
            }
        });
    }
}

export function createMangaRead(client: MangaCordClient, payload: MangaReadPayload, message: Message<TextableChannel>, authorMessage?: Message<TextableChannel>) {
    const paginator = new MangaReadPaginator(client, payload, message, authorMessage);

    paginator.run();
    paginator.initChapter();

    return Promise.resolve(paginator.message);
}
