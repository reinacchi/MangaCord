import { Connection, Model, Schema } from "mongoose";

type Locale = "en" | "id";

export interface Guild {
    createdAt?: Date;
    id?: string;
    name?: string;
    settings?: GuildSettings;
}

export interface GuildSettings {
    locale?: Locale;
    prefix?: string;
}

const GuildSchema = new Schema<Guild>({
    createdAt: {
        required: true,
        type: Date
    },
    id: {
        index: true,
        type: String
    },
    name: {
        required: true,
        type: String
    },
    settings: {
        locale: {
            default:"en",
            required: true,
            type: "String"
        },
        prefix: {
            required: true,
            type: String
        }
    }
});

export function createModel(connection: Connection): Model<Guild> {
    return connection.model("Guild", GuildSchema);
}
