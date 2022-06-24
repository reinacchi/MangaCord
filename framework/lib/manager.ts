import { Manga } from "mangadex-full-api";
import { MangaCordClient } from "./Client";
import { UserModel } from "./Models";
import { RichEmbed } from "./Util";

export class MangaCordManager {
    client: MangaCordClient;

    constructor(client: MangaCordClient) {
        this.client = client;
    }

    /**
     * Check for user's saved manga update frequently
     * @param userIDs An array of user IDs
     */
    public async checkForUpdate(userIDs: string[]) {
        const model = UserModel.createUserModel(this.client.database);

        for (let i = 0; i < userIDs.length; i++) {
            const userData = await model.findOne({ id: userIDs[i] });

            userData.manga.bookmarks.forEach(async (bookmark) => {
                const manga = await Manga.getByQuery({ ids: [bookmark.id] });
                const chapter = await manga.getFeed({ limit: Infinity, order: { chapter: "asc" }, translatedLanguage: ["en"] });
                const newChapter = chapter.pop();

                if (bookmark.lastChapter !== newChapter.chapter) {
                    const embed = new RichEmbed()
                        .setAuthor(manga.title)
                        .setTitle(newChapter.title !== null || undefined ? `New Chapter ${newChapter.chapter}: ${newChapter.title}` : `New Chapter ${newChapter.chapter}`)
                        .setDescription(`Manga [\`${manga.title}\`](https://mangadex.org/title/${manga.id}) just released its new chapter!`);

                    this.client.getDMChannel(userIDs[i]).then((dm) => {
                        return dm.createMessage({ embed });
                    });
                }
            });
        }
    }

    /**
     * Fetch saved manga from user's bookmark library
     * @param userID The ID of the user
     */
    public async fetchMangaUpdate(userID: string) {
        const model = UserModel.createUserModel(this.client.database);
        const userData = await model.findOne({ id: userID });

        if (!userData) {
            return;
        } else {
            return;
        }
    }

    /**
     * Save a manga into the bookmark library
     * @param userID The ID of the user
     * @param manga The manga object
     */
    public async saveManga(userID: string, manga: Manga) {
        const chapter = await manga.getFeed({ limit: Infinity, order: { chapter: "asc" } });
        const model = UserModel.createUserModel(this.client.database);
        const userData = await model.findOne({ id: userID });
        const bookmark = userData.manga.bookmarks.length !== 0 ? userData.manga.bookmarks : [];

        // Push a new manga into the database
        bookmark.push({ id: manga.id, lastChapter: chapter.pop().chapter });

        if (manga.id) {
            await model.findOneAndUpdate({ id: userID }, { $set: { manga: { bookmarks: bookmark } } });
        }
    }
}
