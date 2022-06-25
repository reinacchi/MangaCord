import { Connection, createConnection } from "mongoose";

export class MangaCordDatabase {

    /**
     * The MongoDB URI
     */
    public uri: string;

    /**
     * MongoDB database for MangaCord to store data
     * @param uri The MongoDB URI
     * @param init Whether to initialise at start or not (default is true)
     */
    constructor(uri = "mongodb://localhost:27017/MangaCord", init = true) {
        this.uri = uri;

        if (init) {
            this.connect();
        }
    }

    /**
     * Connect the database
     * @returns {Connection}
     */
    public connect(): Connection {
        return createConnection(this.uri);
    }
}
