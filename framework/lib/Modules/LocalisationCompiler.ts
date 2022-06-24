import { join } from "path";
import { existsSync, mkdirSync, readdirSync, unlinkSync, writeFileSync } from "fs";
import { Logger } from "../Util";

const logger = new Logger();
const folders = readdirSync(join(__dirname, "../../../localisation"));
const compilingDate = new Date();

logger.info({ console: "log", message: "Compiling Localisations...", subTitle: "MangaCordResources::Localisation", title: "LOCALE" });

for (const key in folders) {
    const folder = folders[key];
    if (folder.length !== 2) continue;

    const files = readdirSync(join(__dirname, `../../../localisation/${folder}`));
    let object = {};

    for (const keyFile in files) {
        const file = files[keyFile];

        if (!file.endsWith(".json")) continue;

        /* eslint-disable-next-line */
        const content = require(join(
            __dirname,
            `../../../localisation/${folder}/${file}`
        ));

        if (!Object.keys(content).length) continue;

        object = { ...object, ...content };
    }

    if (!existsSync(join(__dirname, "../locales"))) {
        mkdirSync(join(__dirname, "../locales"));
    }

    if (existsSync(join(__dirname, `../locales/${folder}.json`))) {
        unlinkSync(join(__dirname, `../locales/${folder}.json`));
    }

    writeFileSync(
        join(__dirname, `../locales/${folder}.json`),
        JSON.stringify(object)
    );
}

logger.success({ console: "log", message: `Success! Compiled Localisations in ${compilingDate.getMilliseconds()}ms`, subTitle: "MangaCordResources::Localisation", title: "LOCALE" });
