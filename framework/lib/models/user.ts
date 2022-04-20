import { Connection, Model, Schema } from "mongoose";

export interface UserManga {
    bookmarks: string[];
}

export interface User {
    admin: boolean;
    createdAt: Date;
    id: string;
    manga: UserManga;
    premium: boolean;

}

const UserSchema = new Schema<User>({
    admin: {
        required: true,
        type: Boolean
    }
});

export function createUserModel(connection: Connection): Model<User> {
    return connection.model("User", UserSchema);
}
