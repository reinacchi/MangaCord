import chalk from "chalk";
import moment from "moment";

interface LoggingOptions {
    type?: string;
    title: string;
    subTitle?: string;
    message: string;
}

interface CustomLoggingOptions {
    type: string;
    title: string;
    subTitle?: string;
    message: string;
    color: string;
}

export class Logger {
    public error(options: LoggingOptions): void {
        return console.log(`${chalk.bgRed(` ${options.type ? options.type.toUpperCase() : "ERROR"} `)}${options.subTitle ? chalk.bgWhite(chalk.black(` ${options.subTitle} `)) : ""} ${chalk.underline(options.title.toUpperCase())} - ${chalk.grey(moment().format("MMMM Do YYYY, hh:mm:ss A"))} - ${chalk.magenta(options.message)}`);
    }

    public info(options: LoggingOptions): void {
        return console.log(`${chalk.bgCyan(` ${options.type ? options.type.toUpperCase() : "INFO"} `)}${options.subTitle ? chalk.bgWhite(chalk.black(` ${options.subTitle} `)) : ""} ${chalk.underline(options.title.toUpperCase())} - ${chalk.grey(moment().format("MMMM Do YYYY, hh:mm:ss A"))} - ${chalk.magenta(options.message)}`);
    }

    public log(options: CustomLoggingOptions): void {
        return console.log(`${chalk.bgHex(options.color)(` ${options.type.toUpperCase()} `)}${options.subTitle ? chalk.bgWhite(chalk.black(` ${options.subTitle} `)) : ""} ${chalk.underline(options.title.toUpperCase())} - ${chalk.grey(moment().format("MMMM Do YYYY, hh:mm:ss A"))} - ${chalk.hex(options.color)(options.message)}`);
    }

    public success(options: LoggingOptions): void {
        return console.log(`${chalk.bgRed(` ${options.type ? options.type.toUpperCase() : "SUCCESS"} `)}${options.subTitle ? chalk.bgWhite(chalk.black(` ${options.subTitle} `)) : ""} ${chalk.underline(options.title.toUpperCase())} - ${chalk.grey(moment().format("MMMM Do YYYY, hh:mm:ss A"))} - ${chalk.magenta(options.message)}`);
    }

    public system(options: LoggingOptions): void {
        return console.log(`${chalk.bgBlue(` ${options.type ? options.type.toUpperCase() : "SYSTEM"} `)}${options.subTitle ? chalk.bgWhite(chalk.black(` ${options.subTitle} `)) : ""} ${chalk.underline(options.title.toUpperCase())} - ${chalk.grey(moment().format("MMMM Do YYYY, hh:mm:ss A"))} - ${chalk.magenta(options.message)}`);
    }

    public warn(options: LoggingOptions): void {
        return console.log(`${chalk.bgYellow(` ${options.type ? options.type.toUpperCase() : "WARNING"} `)}${options.subTitle ? chalk.bgWhite(chalk.black(` ${options.subTitle} `)) : ""} ${chalk.underline(options.title.toUpperCase())} - ${chalk.grey(moment().format("MMMM Do YYYY, hh:mm:ss A"))} - ${chalk.magenta(options.message)}`);
    }
}
