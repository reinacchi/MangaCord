import chalk from "chalk";
import moment from "moment";

type ConsoleLogging = "error" | "info" | "log" | "time" | "timeEnd" | "warn";

interface LoggingOptions {
    console: ConsoleLogging;
    type?: string;
    title: string;
    subTitle?: string;
    message: string;
}

interface CustomLoggingOptions {
    console: ConsoleLogging;
    type: string;
    title: string;
    subTitle?: string;
    message: string;
    color: string;
}

export class Logger {
    public error(options: LoggingOptions): void {
        return console[options.console](`${chalk.bgRed(` ${options.type ? options.type.toUpperCase() : "ERROR"} `)}${options.subTitle ? chalk.bgWhite(chalk.black(` ${options.subTitle} `)) : ""} ${chalk.underline(options.title.toUpperCase())} - ${chalk.grey(moment().format("MMMM Do YYYY, hh:mm:ss A"))} - ${chalk.magenta(options.message)}`);
    }

    public info(options: LoggingOptions): void {
        return console[options.console](`${chalk.bgCyan(` ${options.type ? options.type.toUpperCase() : "INFO"} `)}${options.subTitle ? chalk.bgWhite(chalk.black(` ${options.subTitle} `)) : ""} ${chalk.underline(options.title.toUpperCase())} - ${chalk.grey(moment().format("MMMM Do YYYY, hh:mm:ss A"))} - ${chalk.magenta(options.message)}`);
    }

    public log(options: CustomLoggingOptions): void {
        return console[options.console](`${chalk.bgHex(options.color)(` ${options.type.toUpperCase()} `)}${options.subTitle ? chalk.bgWhite(chalk.black(` ${options.subTitle} `)) : ""} ${chalk.underline(options.title.toUpperCase())} - ${chalk.grey(moment().format("MMMM Do YYYY, hh:mm:ss A"))} - ${chalk.hex(options.color)(options.message)}`);
    }

    public success(options: LoggingOptions): void {
        return console[options.console](`${chalk.bgGreen(` ${options.type ? options.type.toUpperCase() : "SUCCESS"} `)}${options.subTitle ? chalk.bgWhite(chalk.black(` ${options.subTitle} `)) : ""} ${chalk.underline(options.title.toUpperCase())} - ${chalk.grey(moment().format("MMMM Do YYYY, hh:mm:ss A"))} - ${chalk.magenta(options.message)}`);
    }

    public system(options: LoggingOptions): void {
        return console[options.console](`${chalk.bgBlue(` ${options.type ? options.type.toUpperCase() : "SYSTEM"} `)}${options.subTitle ? chalk.bgWhite(chalk.black(` ${options.subTitle} `)) : ""} ${chalk.underline(options.title.toUpperCase())} - ${chalk.grey(moment().format("MMMM Do YYYY, hh:mm:ss A"))} - ${chalk.magenta(options.message)}`);
    }

    public warn(options: LoggingOptions): void {
        return console[options.console](`${chalk.bgYellow(` ${options.type ? options.type.toUpperCase() : "WARNING"} `)}${options.subTitle ? chalk.bgWhite(chalk.black(` ${options.subTitle} `)) : ""} ${chalk.underline(options.title.toUpperCase())} - ${chalk.grey(moment().format("MMMM Do YYYY, hh:mm:ss A"))} - ${chalk.magenta(options.message)}`);
    }
}
