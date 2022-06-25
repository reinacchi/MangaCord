import {
    Embed,
    EmbedAuthor,
    EmbedField,
    EmbedFooter,
    EmbedImage,
    EmbedOptions,
} from "eris";
import { Util } from "./Util";

const HEX_REGEX = /^#?([a-fA-F0-9]{6})$/;
const URL_REGEX =
    /^http(s)?:\/\/[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;

export class RichEmbed {

    /**
     * The author of the embed
     */
    author: EmbedAuthor;

    /**
     * The colour of the embed
     */
    colour: number;

    /**
     * The description of the embed
     */
    description: string;

    /**
     * An array of embed fields
     */
    fields: EmbedField[];

    /**
     * The footer of the embed
     */
    footer: EmbedFooter;

    /**
     * The image of the embed
     */
    image: EmbedImage;

    /**
     * the thumbnail of the embed
     */
    thumbnail: EmbedImage;

    /**
     * The timestamp of the embed
     */
    timestamp: Date | string;

    /**
     * The title of the embed
     */
    title: string;

    /**
     * The title URL of the embed
     */
    url: string;

    /**
     * Creates an Embed
     * @param data Embed data options
     */
    constructor(data: EmbedOptions = {}) {
        if (data.title) this.title = data.title;
        if (data.description) this.description = data.description;
        if (data.url) this.url = data.url;
        if (data.timestamp) this.timestamp = data.timestamp;
        if (data.color) this.colour = data.color;
        if (data.footer) this.footer = data.footer;
        if (data.image) this.image = data.image;
        if (data.thumbnail) this.thumbnail = data.thumbnail;
        if (data.author) this.author = data.author;
        this.fields = data.fields || [];
    }

    /**
     * The length of the embed
     */
    public get length(): number {
        return (
            (this.title?.length ?? 0) +
            (this.description?.length ?? 0) +
            (this.fields.length >= 1
                ? this.fields.reduce((prev, curr) => prev + curr.name.length + curr.value.length, 0)
                : 0) +
            (this.footer?.text.length ?? 0) +
            (this.author?.name.length ?? 0)
        );
    }

    private _fieldEquals(field: EmbedField, otherField: EmbedField): boolean {
        return field.name === otherField.name && field.value === otherField.value && field.inline === otherField.inline;
    }

    /**
     * Add a field on the embed
     * @param name The name of the embed field
     * @param value The value of the embed field
     * @param inline Whether to set the embed field as inline or not
     * @returns {RichEmbed}
     */
    public addField(name: string, value: string, inline = false): RichEmbed {
        if (this.fields.length >= 25)
            throw new RangeError("Embeds cannot contain more than 25 fields");
        if (typeof name !== "string")
            throw new TypeError(
                `Expected type 'string', received type ${typeof name}`
            );
        if (typeof value !== "string")
            throw new TypeError(
                `Expected type 'string', received type ${typeof value}`
            );
        if (typeof inline !== "boolean")
            throw new TypeError(
                `Expected type 'boolean', received type ${typeof inline}`
            );
        if (name.length > 256)
            throw new RangeError("Embed field names cannot exceed 256 characters");
        if (value.length > 1024)
            throw new RangeError(
                "Embed field descriptions cannot exceed 1024 characters"
            );

        this.fields.push({ inline, name, value });
        return this;
    }

    /**
     * Compare this embed with another whether they're the same or not
     * @param embed The embed to compare
     * @returns {Boolean}
     */
    public equals(embed: Embed): boolean {
        return (
            this.author?.name === embed.author?.name &&
            this.author?.url === embed.author?.url &&
            this.author?.icon_url === (embed.author?.icon_url ?? embed.author?.icon_url) &&
            this.colour === embed.color &&
            this.title === embed.title &&
            this.description === embed.description &&
            this.url === embed.url &&
            this.timestamp === embed.timestamp &&
            this.fields.length === embed.fields.length &&
            this.fields.every((field, i) => this._fieldEquals(field, embed.fields[i])) &&
            this.footer?.text === embed.footer?.text &&
            this.footer?.icon_url === (embed.footer?.icon_url ?? embed.footer?.icon_url) &&
            this.image?.url === embed.image?.url &&
            this.thumbnail?.url === embed.thumbnail?.url
        );
    }

    /**
     * Normalise the embed field
     * @param name The name of the embed field
     * @param value The value of the embed field
     * @param inline Whether to set the embed field as inline or not
     * @returns {EmbedField}
     */
    public normaliseField(name: string, value: string, inline = false): EmbedField {
        return {
            inline,
            name: Util.verifyString(name, RangeError, "EMBED_FIELD_NAME", false),
            value: Util.verifyString(value, RangeError, "EMBED_FIELD_VALUE", false),
        };
    }

    /**
     * Normalise an array of embed fields
     * @param fields An array of embed fields
     * @returns {EmbedField}
     */
    public normaliseFields(...fields: EmbedField[]): EmbedField[] {
        return fields
            .flat(2)
            .map(field =>
                this.normaliseField(field.name, field.value, typeof field.inline === "boolean" ? field.inline : false),
            );
    }

    /**
     * Set the author of the embed
     * @param name The name of the embed author
     * @param url the URL of the embed author
     * @param iconURL The icon URL of the embed author
     * @returns {RichEmbed}
     */
    public setAuthor(name: string, url?: string, iconURL?: string): RichEmbed {
        if (typeof name !== "string")
            throw new TypeError(
                `Expected type 'string', received type ${typeof name}`
            );
        if (name.length > 256)
            throw new RangeError("Embed author names cannot exceed 256 characters");
        this.author = { name };

        if (url !== undefined) {
            if (typeof url !== "string")
                throw new TypeError(
                    `Expected type 'string', received type '${typeof url}'`
                );
            if (!URL_REGEX.test(url)) throw new Error("Not a well formed URL");
            this.author.url = url;
        }

        if (iconURL !== undefined) {
            if (typeof iconURL !== "string")
                throw new TypeError(
                    `Expected type 'string', received type '${typeof iconURL}'`
                );
            if (!iconURL.startsWith("attachment://") && !URL_REGEX.test(iconURL))
                throw new Error("Not a well formed URL");
            this.author.icon_url = iconURL;
        }

        return this;
    }

    /**
     * Set the colour of the embed
     * @param colour The colour of the embed
     * @returns {RichEmbed}
     */
    public setColour(colour: string | number): RichEmbed {
        if (typeof colour !== "string" && typeof colour !== "number")
            throw new TypeError(
                `Expected types 'string' or 'number', received type ${typeof colour} instead`
            );

        if (typeof colour === "number") {
            if (colour > 16777215 || colour < 0) throw new RangeError("Invalid color");
            this.colour = colour;
        } else {
            const match = colour.match(HEX_REGEX);
            if (!match) throw new Error("Invalid color");
            this.colour = parseInt(match[1], 16);
        }

        return this;
    }

    /**
     * Set the description of the embed
     * @param description The description of the embed
     * @returns {RichEmbed}
     */
    public setDescription(description: string): RichEmbed {
        if (typeof description !== "string")
            throw new TypeError(
                `Expected type 'string', received type '${typeof description}'`
            );
        if (description.length > 4096)
            throw new RangeError("Embed descriptions cannot exceed 4096 characters");
        this.description = description;
        return this;
    }

    /**
     * Set the footer of the embed
     * @param text The text of the embed footer
     * @param iconURL The icon URL of the embed footer
     * @returns {RichEmbed}
     */
    public setFooter(text: string, iconURL: string = undefined): RichEmbed {
        if (typeof text !== "string")
            throw new TypeError(
                `Expected type 'string', received type ${typeof text}`
            );
        if (text.length > 2048)
            throw new RangeError("Embed footer texts cannot exceed 2048 characters");
        this.footer = { text };

        if (iconURL !== undefined) {
            if (typeof iconURL !== "string")
                throw new TypeError(
                    `Expected type 'string', received type '${typeof iconURL}'`
                );
            if (!iconURL.startsWith("attachment://") && !URL_REGEX.test(iconURL))
                throw new Error("Not a well formed URL");
            this.footer.icon_url = iconURL;
        }

        return this;
    }

    /**
     * Set the image of the embed
     * @param imageURL The image URL of the embed
     * @returns {RichEmbed}
     */
    public setImage(imageURL: string): RichEmbed {
        if (typeof imageURL !== "string")
            throw new TypeError(
                `Expected type 'string', received type ${typeof imageURL}`
            );
        if (!imageURL.startsWith("attachment://") && !URL_REGEX.test(imageURL))
            throw new Error("Not a well formed URL");
        this.image = { url: imageURL };
        return this;
    }

    /**
     * Set the thumbnail of the embed
     * @param thumbnailURL The thumbnail URL of the embed
     * @returns {RichEmbed}
     */
    public setThumbnail(thumbnailURL: string): RichEmbed {
        this.thumbnail = { url: thumbnailURL };
        return this;
    }

    /**
     * Set the timestamp of the embed
     * @param timestamp The timestamp of the embed (default is current date)
     * @returns {RichEmbed}
     */
    public setTimestamp(timestamp: Date | number = new Date()): RichEmbed {
        if (Number.isNaN(new Date(timestamp).getTime()))
            throw new Error("Invalid Date");
        this.timestamp = new Date(timestamp);
        return this;
    }

    /**
     * Set the title of the embed
     * @param title The title of the embed
     * @returns {RichEmbed}
     */
    public setTitle(title: string): RichEmbed {
        if (typeof title !== "string")
            throw new TypeError(
                `Expected type 'string', received type '${typeof title}'`
            );
        if (title.length > 256)
            throw new RangeError("Embed titles cannot exceed 256 characters");
        this.title = title;
        return this;
    }

    /**
     * Set the URL of the embed title
     * @param url The URL of the embed title
     * @returns {RichEmbed}
     */
    public setURL(url: string): RichEmbed {
        if (typeof url !== "string")
            throw new TypeError(
                `Expected type 'string', received type '${typeof url}'`
            );
        if (!URL_REGEX.test(url)) throw new Error("Not a well formed URL");
        this.url = url;
        return this;
    }

    /**
     * Splice embed fields
     * @param index The index of fields
     * @param deleteCount The number of delete count
     * @param fields An array of embed fields
     * @returns {RichEmbed}
     */
    public spliceFields(index: number, deleteCount: number, ...fields: any): RichEmbed {
        this.fields.splice(index, deleteCount, ...this.normaliseFields(...fields));
        return this;
    }
}
