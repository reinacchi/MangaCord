import { Connection, Model, Schema } from "mongoose";

export interface DiscordUser {
    avatar: string;
    discriminator: string;
    id: string;
    username: string;
}

export interface User {
    admin: boolean;
    badge: UserBadge;
    discordUser: DiscordUser;
}

export interface UserBadge {
    admin: boolean;
    mod: boolean;
    owner: boolean;
    supporter: boolean;
    verified: boolean;
}

const UserSchema = new Schema<User>({
    admin: {
        required: true,
        type: Boolean
    },
    badge: {
        required: true,
        type: Object
    },
    discordUser: {
        required: true,
        type: Object
    }
});

export function createUserModel(connection: Connection): Model<User> {
    return connection.model("User", UserSchema);
}
