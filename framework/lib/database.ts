import { createConnection } from "mongoose";

export class MangaCordDatabase {
    public uri: string;

    constructor(uri = "mongodb://localhost:27017/MangaCord", init = true) {
        this.uri = uri;

        if (init) {
            this.connect();
        }
    }

    public connect() {
        return createConnection(this.uri);
    }
}
