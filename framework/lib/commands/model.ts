import { Connection } from "mongoose";
import { GuildModel, UserModel } from "../models";

export function createGuildModel(connection: Connection, body: GuildModel.Guild) {
    const model = GuildModel.createModel(connection);

    model.create(body);
}

export function createUserModel(connection: Connection, body: UserModel.User) {
    const model = UserModel.createUserModel(connection);

    model.create(body);
}
