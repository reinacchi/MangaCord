import { AdvancedMessageContent, ComponentInteraction, EmbedOptions, Message, TextableChannel } from "eris";
import { Chapter, Manga } from "mangadex-full-api";
import { MangaCordClient } from "../client";
import { RichEmbed } from "./richembed";
import moment from "moment";

class MangaSearchPaginator {
    authorMessage: Message<TextableChannel>;

    client: MangaCordClient;

    mangaResults: Manga[];

    message: Message<TextableChannel>;

    constructor(client: MangaCordClient, mangaResults: Manga[], message: Message<TextableChannel>, authorMessage?: Message<TextableChannel>) {
        this.authorMessage = authorMessage;
        this.client = client;
        this.mangaResults = mangaResults;
        this.message = message;
    }
}
