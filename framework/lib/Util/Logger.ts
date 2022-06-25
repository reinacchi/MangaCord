import chalk from "chalk";
import moment from "moment";

type ConsoleLogging = "error" | "info" | "log" | "time" | "timeEnd" | "warn";

interface LoggingOptions {
    console: ConsoleLogging;
    message: string;
    subTitle?: string;
    title: string;
    type?: string;
}

interface CustomLoggingOptions {
    colour: string;
    console: ConsoleLogging;
    message: string;
    subTitle?: string;
    title: string;
    type: string;
}

export class Logger {

    /**
     * Logs an error message
     * @param options The logging options
     * @param options.console The console type
     * @param options.message The logging message
     * @param options.subTitle The logging subtitle
     * @param options.title The logging title
     * @param options.type The logging type
     * @returns {void}
     */
    public error(options: LoggingOptions): void {
        return console[options.console](`${chalk.bgRed(` ${options.type ? options.type.toUpperCase() : "ERROR"} `)}${options.subTitle ? chalk.bgWhite(chalk.black(` ${options.subTitle} `)) : ""} ${chalk.underline(options.title.toUpperCase())} - ${chalk.grey(moment().format("MMMM Do YYYY, hh:mm:ss A"))} - ${chalk.magenta(options.message)}`);
    }

    /**
     * Logs an info message
     * @param options The logging options
     * @param options.console The console type
     * @param options.message The logging message
     * @param options.subTitle The logging subtitle
     * @param options.title The logging title
     * @param options.type The logging type
     * @returns {void}
     */
    public info(options: LoggingOptions): void {
        return console[options.console](`${chalk.bgCyan(` ${options.type ? options.type.toUpperCase() : "INFO"} `)}${options.subTitle ? chalk.bgWhite(chalk.black(` ${options.subTitle} `)) : ""} ${chalk.underline(options.title.toUpperCase())} - ${chalk.grey(moment().format("MMMM Do YYYY, hh:mm:ss A"))} - ${chalk.magenta(options.message)}`);
    }

    /**
     * Logs a custom logging message
     * @param options The logging options
     * @param options.colour The custom colour for the log
     * @param options.console The console type
     * @param options.message The logging message
     * @param options.subTitle The logging subtitle
     * @param options.title The logging title
     * @param options.type The logging type
     * @returns {void}
     */
    public log(options: CustomLoggingOptions): void {
        return console[options.console](`${chalk.bgHex(options.colour)(` ${options.type.toUpperCase()} `)}${options.subTitle ? chalk.bgWhite(chalk.black(` ${options.subTitle} `)) : ""} ${chalk.underline(options.title.toUpperCase())} - ${chalk.grey(moment().format("MMMM Do YYYY, hh:mm:ss A"))} - ${chalk.hex(options.colour)(options.message)}`);
    }

    /**
     * Logs a success message
     * @param options The logging options
     * @param options.console The console type
     * @param options.message The logging message
     * @param options.subTitle The logging subtitle
     * @param options.title The logging title
     * @param options.type The logging type
     * @returns {void}
     */
    public success(options: LoggingOptions): void {
        return console[options.console](`${chalk.bgGreen(` ${options.type ? options.type.toUpperCase() : "SUCCESS"} `)}${options.subTitle ? chalk.bgWhite(chalk.black(` ${options.subTitle} `)) : ""} ${chalk.underline(options.title.toUpperCase())} - ${chalk.grey(moment().format("MMMM Do YYYY, hh:mm:ss A"))} - ${chalk.magenta(options.message)}`);
    }

    /**
     * Logs a system message
     * @param options The logging options
     * @param options.console The console type
     * @param options.message The logging message
     * @param options.subTitle The logging subtitle
     * @param options.title The logging title
     * @param options.type The logging type
     * @returns {void}
     */
    public system(options: LoggingOptions): void {
        return console[options.console](`${chalk.bgBlue(` ${options.type ? options.type.toUpperCase() : "SYSTEM"} `)}${options.subTitle ? chalk.bgWhite(chalk.black(` ${options.subTitle} `)) : ""} ${chalk.underline(options.title.toUpperCase())} - ${chalk.grey(moment().format("MMMM Do YYYY, hh:mm:ss A"))} - ${chalk.magenta(options.message)}`);
    }

    /**
     * Lgos a warn message
     * @param options The logging options
     * @param options.console The console type
     * @param options.message The logging message
     * @param options.subTitle The logging subtitle
     * @param options.title The logging title
     * @param options.type The logging type
     * @returns {void}
     */
    public warn(options: LoggingOptions): void {
        return console[options.console](`${chalk.bgYellow(` ${options.type ? options.type.toUpperCase() : "WARNING"} `)}${options.subTitle ? chalk.bgWhite(chalk.black(` ${options.subTitle} `)) : ""} ${chalk.underline(options.title.toUpperCase())} - ${chalk.grey(moment().format("MMMM Do YYYY, hh:mm:ss A"))} - ${chalk.magenta(options.message)}`);
    }
}
