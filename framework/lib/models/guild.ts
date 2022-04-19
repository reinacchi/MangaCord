import { Connection, Model, Schema } from "mongoose";

export interface Guild {
    createdAt: Date;
    id: string;
    name: string;
    settings: GuildSettings;
}

export interface GuildSettings {
    prefix: string;
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
        prefix: {
            required: true,
            type: String
        }
    }
});

export function createModel(connection: Connection): Model<Guild> {
    return connection.model("Guild", GuildSchema);
}
