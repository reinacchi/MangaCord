interface ConfigAPI {
    BASE_URL: string;
    DISCORD_AUTH: ConfigAPIDiscordAuth;
    SESSION_SECRET: string;
}

interface ConfigAPIDiscordAuth {
    CLIENT_ID: string;
    CLIENT_SECRET: string;
}

interface ConfigBot {
    ADMIN: Array<string>;
    PREFIX: string;
    TOKEN: string;
}

interface ConfigMongoDB {
    NAME: string;
    HOST: string;
}

export interface Config {
    API: ConfigAPI;
    BOT: ConfigBot;
    MONGODB: ConfigMongoDB;
}
