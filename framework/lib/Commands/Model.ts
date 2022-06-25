import { Connection } from "mongoose";
import { GuildModel, UserModel } from "../Models";

/**
 * Create a guild model
 * @param connection The database connection
 * @param body The body payload
 */
export function createGuildModel(connection: Connection, body: GuildModel.Guild): void {
    const model = GuildModel.createModel(connection);

    model.create(body);
}

/**
 * Create a user model
 * @param connection The database connection
 * @param body The body payload
 */
export function createUserModel(connection: Connection, body: UserModel.User): void {
    const model = UserModel.createUserModel(connection);

    model.create(body);
}
