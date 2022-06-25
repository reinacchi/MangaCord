"use strict";

import { EventEmitter } from "events";
import Eris from "eris";

export interface MessageCollectorOptions {
    count?: number;
    timeout?: number;
    filter?: (msg: Eris.Message<Eris.TextableChannel>) => boolean;
}

const MessageCollectorDefaults = {
    count: 10,
    timeout: 10000,
    filter: (_msg) => true, // eslint-disable-line
};

/**
 * Creates a special built-in Message collector
 */
export class MessageCollector extends EventEmitter {

    /**
     * The channel to collect messages
     */
    public channel: Eris.TextableChannel;

    /**
     * The timeout for the message collector
     */
    public timeout: number;

    /**
     * The collected Eris' Message
     */
    public message: Eris.Message<Eris.TextableChannel>;

    /**
     * The length of messages collected
     */
    public count: number;

    /**
     * Optional adjustable filter for the message collector
     */
    public filter: ((_msg: any) => boolean) & ((msg: Eris.Message<Eris.TextableChannel>) => boolean);

    /**
     * The collection of collected messages
     */
    public collected: Eris.Collection<Eris.Message<Eris.TextableChannel>>;

    /**
     * Whether the message collector is still running or not
     */
    public running: boolean;

    /**
   * Construct a new MessageCollector
   * @param channel The channel to collect messages
   * @param options Options to enhance the collecting system
   */
    constructor(channel: Eris.TextableChannel, options: MessageCollectorOptions) {
        super();
        const opt = Object.assign(MessageCollectorDefaults, options);
        this.channel = channel;
        this.timeout = opt.timeout;
        this.count = opt.count;
        this.filter = opt.filter;
        this.collected = new Eris.Collection(Eris.Message);
        this.running = false;

        this._onMessageCreate = this._onMessageCreate.bind(this);
        this._onMessageDelete = this._onMessageDelete.bind(this);
        this._onMessageUpdate = this._onMessageUpdate.bind(this);

        this.onCollect = this.onCollect.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
    }

    private _onMessageCreate(msg: Eris.Message<Eris.TextableChannel>) {
        if (!this.running) return;
        if (this.channel.id !== msg.channel.id) return;
        if (!this.filter(msg)) return;
        this.emit("collect", msg);
    }

    private _onMessageUpdate(msg: Eris.Message<Eris.TextableChannel>, oldMsg: Eris.Message<Eris.TextableChannel>) {
        if (!this.running) return;
        if (this.channel.id !== msg.channel.id) return;
        if (!this.filter(msg)) return this.collected.remove(msg);
        if (!this.collected.has(oldMsg.id)) return this.emit("collect", msg);
        this.emit("update", msg);
    }

    private _onMessageDelete(msg: Eris.Message<Eris.TextableChannel>) {
        if (!this.running) return;
        if (!this.collected.has(msg.id)) return;
        this.emit("delete", msg);
    }

    /**
     * Runs the message collector
     * @returns {Promise<MessageCollector>}
     */
    public run(): Promise<MessageCollector> {
        this.running = true;
        return new Promise((res) => {
            this.channel.client.setMaxListeners(this.getMaxListeners() + 1);
            this.channel.client.on("messageCreate", this._onMessageCreate);
            this.channel.client.on("messageUpdate", this._onMessageUpdate);
            this.channel.client.on("messageDelete", this._onMessageDelete);

            this.setMaxListeners(this.getMaxListeners() + 1);
            this.on("collect", this.onCollect);
            this.on("update", this.onUpdate);
            this.on("delete", this.onDelete);

            if (this.timeout) setTimeout(() => this.stop(), this.timeout);
            this.once("stop", () => res(this));
        });
    }

    /**
     * Stops the message collector
     * @returns {MessageCollector>}
     */
    public stop(): MessageCollector {
        this.running = false;
        this.channel.client.setMaxListeners(this.getMaxListeners() - 1);
        this.channel.client.off("messageCreate", this._onMessageCreate);
        this.channel.client.off("messageUpdate", this._onMessageUpdate);
        this.channel.client.off("messageDelete", this._onMessageDelete);

        this.setMaxListeners(this.getMaxListeners() - 1);
        this.off("collect", this.onCollect);
        this.off("update", this.onUpdate);
        this.off("delete", this.onDelete);
        this.emit("stop");
        return this;
    }

    /**
     * Collect messages
     * @param msg The collected message
     */
    public onCollect(msg: Eris.Message<Eris.TextableChannel>): void {
        this.collected.add(msg);
        this.message = msg;
        if (this.count && this.collected.size === this.count) this.stop();
    }

    /**
     * Update collected messages
     * @param msg The updated message
     */
    public onUpdate(msg: Eris.Message<Eris.TextableChannel>): void {
        this.collected.update(msg);
    }

    /**
     * Delete messages from the collection
     * @param msg The deleted message
     */
    public onDelete(msg: Eris.Message<Eris.TextableChannel>): void {
        this.collected.remove(msg);
    }
}
