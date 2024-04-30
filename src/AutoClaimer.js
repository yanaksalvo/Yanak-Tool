"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const ws_1 = __importDefault(require("ws"));
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

const guilds_1 = { default: {} };
const setTitle = require('console-title');

class Sniper {
    constructor(options) {
        this.opcodes = {
            DISPATCH: 0,
            HEARTBEAT: 0.001,
            IDENTIFY: 2,
            RECONNECT: 7,
            HELLO: 10,
            HEARTBEAT_ACK: 11,
        };



        this.options = options

        if (!options?.AutoClaimerGuildID || !options?.AutoClaimerSelfToken || !options?.AutoClaimerSelfTokenCatcher) {
            console.clear();
            setTitle('Vanity Sniper V15 /  / https://discord.gg/ajkzDGSMg2 / AutoClaimer / Config file missing something.');
            console.log('\u001b[34mCreated   | \nto buy please enter the discord: https://discord.gg/ajkzDGSMg2\n\n\u001b[0m')
            console.log(`\x1b[41m » yANAKTOOL  :\x1b[0m Config file missing something.\x1b[0m`);
            return false;
        }

        setTitle('Vanity Sniper V15 /  / https://discord.gg/ajkzDGSMg2 / AutoClaimer / Standby.');

        this.SNIPER_GUILD_ID = options.AutoClaimerGuildID
        this.SNIPER_SELF_TOKEN = options.AutoClaimerSelfToken
        this.URL_SNIPER_SELF_TOKEN = options.AutoClaimerSelfTokenCatcher

        this.SUCCESS_WEBHOOK = options.AutoClaimerSuccessWebhook
        this.FAILED_WEBHOOK = options.AutoClaimerFailedWebhook

        console.clear();
        console.log('\u001b[34mCreated   | \nto buy please enter the discord: https://discord.gg/ajkzDGSMg2\n\n\x1b[0m');

        this.interval = null;
        this.createPayload = (data) => JSON.stringify(data);
        this.heartbeat = () => {
            return this.socket.send(this.createPayload({
                op: 1,
                d: {},
                s: null,
            }));
        };
        this.socket = new ws_1.default("wss://gateway.discord.gg");
        this.socket.on("open", () => {
            try {
                this.socket.on("message", async (message) => {
                    const data = JSON.parse(message);
                    if (data.op === this.opcodes.DISPATCH) {
                        if (data.t === "GUILD_UPDATE") {
                            const find = guilds_1.default[data.d.guild_id];
                            if (typeof find?.vanity_url_code === 'string' && find.vanity_url_code !== data.d.vanity_url_code) {
                                const start = Date.now();
                                (0, node_fetch_1.default)(`https://canary.discord.com/api/guilds/${this.SNIPER_GUILD_ID}/vanity-url`, {
                                    method: "PATCH",
                                    body: this.createPayload({
                                        code: find.vanity_url_code,
                                    }),
                                    headers: {
                                        Authorization: this.URL_SNIPER_SELF_TOKEN,
                                        "Content-Type": "application/json",
                                    },
                                }).then(async (res) => {
                                    if (res.ok) {
                                        const end = Date.now();
                                        const elapsedMs = end - start;
                                        console.log('\x1b[34m' + find.vanity_url_code + '\u001b[0m / \x1b[35mVanity Claimed In \x1b[1;34m' + elapsedMs + 'ms\u001b[0m')
                                        await this.sendWebhook(this.SUCCESS_WEBHOOK, {
                                            color: 15548997,
                                            fields: [{
                                                
                                                name: "Claimed Vanity",
                                                value: "```" + find.vanity_url_code + "```"
                                            }, {
                                                name: "Guild",
                                                value: "```" + this.SNIPER_GUILD_ID + "```"
                                            }, {
                                                name: "Speed",
                                                value: "```" + elapsedMs + "ms```"
                                            }, {
                                                name: "Source",
                                                value: "```Made With ♡ By  ```"
                                            }],
                                            footer: {
                                                text: "https://discord.gg/ajkzDGSMg2",
                                                icon_url: "https://cdn.discordapp.com/ephemeral-attachments/1183005417970876578/1190301536618815668/Picsart_23-12-28_21-20-58-809.jpg?ex=65a14db1&is=658ed8b1&hm=9f8cee54d9ac69d44950d3a4e4e01a5b878bb2854441ab2219d5d0d0bd83837f&"
                                            }
                                        })
                                        require('readline-sync').prompt()
                            
                                        process.exit();
                                    }
                                    else {
                                        console.log('\u001b[31m\u001b[0m discord.gg/\x1b[1;34m' + find.vanity_url_code + '\u001b[0m / \u001b[31mVanity failed to claim\u001b[0m')
                                        this.sendWebhook(this.FAILED_WEBHOOK, {
                                            title: "❌ • Failed claim !",
                                            color: 11745850,
                                            fields: [{
                                                name: "Vanity:",
                                                value: "```discord.gg/" + find.vanity_url_code + "```"
                                            }, {
                                                name: 'Reason:',
                                                value: "```" + JSON.stringify(error, null, 4) + "```"
                                            }],
                                            footer: {
                                                text: "AutoClaimer Tool • ",
                                                icon_url: "https://cdn.discordapp.com/ephemeral-attachments/1183005417970876578/1190301536618815668/Picsart_23-12-28_21-20-58-809.jpg?ex=65a14db1&is=658ed8b1&hm=9f8cee54d9ac69d44950d3a4e4e01a5b878bb2854441ab2219d5d0d0bd83837f&"
                                            }
                                        })
                                    }
                                    delete guilds_1.default[data.d.guild_id];
                                }).catch(err => {
                                    return delete guilds_1.default[data.d.guild_id];
                                });
                            }
                        }
                        else {
                            if (data.t === "READY") {
                                data.d.guilds
                                    .filter((e) => typeof e.vanity_url_code === "string")
                                    .forEach((e) => {
                                        guilds_1.default[e.id] = { vanity_url_code: e.vanity_url_code };
                                        console.log('\u001b[31m\x1b[31m[ Vanity : ] \x1b[35m [ ' + e.vanity_url_code + ' ] \x1b[34m -  [ ' + e.name + ' ] - \x1b[33m [ ' + e.id + ' ]')
                                    });
                                console.log('')
                            }
                            else if (data.t === "GUILD_Created") {
                                guilds_1.default[data.d.id] = { vanity_url_code: data.d.vanity_url_code };
                            }
                            else if (data.t === "GUILD_DELETE") {
                                const find = guilds_1.default[data.d.id];
                                setTimeout(() => {
                                    if (typeof find?.vanity_url_code === "string") {
                                        const start = Date.now();
                                        (0.01, node_fetch_1.default)(`https://discord.com/api/v10/guilds/${this.SNIPER_GUILD_ID}/vanity-url`, {
                                            method: "PATCH",
                                            body: this.createPayload({
                                                code: find.vanity_url_code,
                                            }),
                                            headers: {
                                                Authorization: this.URL_SNIPER_SELF_TOKEN,
                                                "Content-Type": "application/json",
                                            },
                                        }).then(async (res) => {
                                            if (res.ok) {
                                                const end = Date.now();
                                                const elapsedMs = end - start;
                                                await this.sendWebhook(this.SUCCESS_WEBHOOK, {
                                                    title: "<:check_3:1147536429572952085> • Successfully claim!",
                                                    color: 5747514,
                                                    fields: [{
                                                        name: "Vanity:",
                                                        value: "```discord.gg/" + find.vanity_url_code + "```"
                                                    }, {
                                                        name: "Guild Id:",
                                                        value: "```" + this.SNIPER_GUILD_ID + "```"
                                                    }, {
                                                        name: "Accuracy (Seconds):",
                                                        value: "```" + (elapsedMs / 1000).toFixed(3) + "s```"
                                                    }, {
                                                        name: "Speed (In Ms):",
                                                        value: "```" + elapsedMs + "ms```"
                                                    }, {
                                                        name: "Source:",
                                                        value: "```yANAK Tool • ```"
                                                    }],
                                                    footer: {
                                                        text: "yANAK Tool • ",
                                                        icon_url: "https://cdn.discordapp.com/ephemeral-attachments/1183005417970876578/1190301536618815668/Picsart_23-12-28_21-20-58-809.jpg?ex=65a14db1&is=658ed8b1&hm=9f8cee54d9ac69d44950d3a4e4e01a5b878bb2854441ab2219d5d0d0bd83837f&"
                                                    }
                                                })
                                                require('readline-sync').prompt()
                                    
                                                process.exit();
                                            }
                                            else {
                                                const error = await res.json();
                                                this.sendWebhook(this.FAILED_WEBHOOK, {
                                                    title: "❌ • Failed claim !",
                                                    color: 11745850,
                                                    fields: [{
                                                        name: "Vanity:",
                                                        value: "```discord.gg/" + find.vanity_url_code + "```"
                                                    }, {
                                                        name: 'Reason:',
                                                        value: "```" + JSON.stringify(error, null, 4) + "```"
                                                    }],
                                                    footer: {
                                                        text: "yANAK Tool • ",
                                                        icon_url: "https://cdn.discordapp.com/ephemeral-attachments/1183005417970876578/1190301536618815668/Picsart_23-12-28_21-20-58-809.jpg?ex=65a14db1&is=658ed8b1&hm=9f8cee54d9ac69d44950d3a4e4e01a5b878bb2854441ab2219d5d0d0bd83837f&"
                                                    }
                                                })
                                            }
                                            delete guilds_1.default[data.d.guild_id];
                                        }).catch(err => {
                                            console.log(err);
                                            return delete guilds_1.default[data.d.guild_id];
                                        });
                                    }
                                }, 0);
                            }
                        }
                    }
                    else if (data.op === this.opcodes.RECONNECT) {
                        return this.restart();
                    }
                    else if (data.op === this.opcodes.HELLO) {
                        clearInterval(this.interval);
                        this.interval = setInterval(() => this.heartbeat(), data.d.heartbeat_interval);
                        this.socket.send(this.createPayload({
                            op: this.opcodes.IDENTIFY,
                            d: {
                                token: this.SNIPER_SELF_TOKEN,
                                intents: 1,
                                properties: {
                                    os: "macos",
                                    browser: "Safari",
                                    device: "MacBook Air",
                                },
                            },
                        }));
                    }
                });
            } catch (err) {
                console.log(err)
            }
            this.socket.on("close", (reason) => {
                return this.restart();
            });
            this.socket.on("error", (error) => {
                console.log(error);
                require('readline-sync').prompt()
                process.exit();
            });

            this.restart = () => {
                new Sniper(this.options);
            };

        });
    }

    async sendWebhook(url, embed) {
        if (url) {
            await node_fetch_1(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "content": null,
                    "embeds": [embed],
                    "attachments": []
                })
            }).then(response => {
                if (!response.ok) {
                    console.error('Failed to send webhook');
                }
            }).catch(error => {
                console.error('Error:', error);
            });
            
            
        }
    }
}

module.exports = Sniper;