const tokens = require('fs').readFileSync('./config/Swapper-tokens.txt', 'utf-8').replace(/\r/g, '').split('\n'),
      fetch = require('node-fetch'),
      setTitle = require('console-title');

module.exports = class Sniper {
    constructor(options) {
        if (options?.SwapperGuildID && options?.SwapperWebhookURL && options?.SwapperCode) {
            this.tokens = tokens;
            this.code = options?.SwapperCode;
            this.guildId = options?.SwapperGuildID;
            this.licenseKey = options.licenseKey;
            this.Webhook = options?.SwapperWebhookURL;
            this.tokenPosition = 0;
            this.snipped = false
            this.interval = options?.SwapperInterval ?? 100
            
            this.start();
        } else {
            console.clear()
            setTitle('Vanity Sniper V15 /  / https://discord.gg/ajkzDGSMg2 / Swapper / Config file missing something');
            console.log('\u001b[34mCREATE  | \nto buy please enter the discord: https://discord.gg/ajkzDGSMg2\n\n\u001b[0m')
            console.log(`\x1b[41m » SWAPPER :\x1b[0m Config file missing something.\x1b[0m`);    
            return false;
        }
    }
 
    start = async () => {
        console.clear();
        setTitle('Vanity Sniper V15 /  / https://discord.gg/ajkzDGSMg2 / Swapper / Server ID: ['+this.guildId+']');
        console.log('\u001b[34mCREATE  | \nto buy please enter the discord: https://discord.gg/ajkzDGSMg2\n\n\x1b[0m');
        await this.sleep(2000);

        console.log('\u001b[38;5;226mSwapper: Awaiting for [discord.gg/'+this.code+'].')

        while (!this.snipped) {
            this.snipe();
            await this.sleep(this.interval);
        }

        console.log('\u001b[38;5;226mSwapper: \u001b[32mSuccessfully Swapped ['+this.code+'] in '+(Math.floor(this.accuracy/3)/100)+'s.')

        if (this?.Webhook) {
            await fetch(this?.Webhook, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    "content": null,
                    "embeds": [{
                        "title": "> **Swap done.!**",
                        "color": 62945,
                        "fields": [
                            {
                                "name": "Vanity",
                                "value": "```discord.gg/"+this.code+"```",
                                "inline": true
                            },{
                                "name": "Interval",
                                "value": "```"+this.interval+"ms```",
                                "inline": true
                            },{
                                "name": "Accuracy",
                                "value": "```"+(Math.floor(this.accuracy/3)/100)+"ms```",
                                "inline": true
                            }
                        ],
                        "footer": {
                            "text": "SWAP ",
                            "icon_url": "https://cdn.discordapp.com/attachments/1060915817975386202/1197718558348673024/Great_Military_Soldier_Animated_Gifs.gif?ex=65bc4954&is=65a9d454&hm=506428862aaf51a4f5c0f449b347627c45f7436061253f64349aaaefab9a47fa&"
                        },
                        "thumbnail": {
                            "url": "https://cdn.discordapp.com/attachments/1060915817975386202/1197718558348673024/Great_Military_Soldier_Animated_Gifs.gif?ex=65bc4954&is=65a9d454&hm=506428862aaf51a4f5c0f449b347627c45f7436061253f64349aaaefab9a47fa&"
                        }
                    }],
                    "attachments": []
                })
            })
        }

        require('readline-sync').prompt()
        process.exit();
    }

    snipe = async () => {
        const startTime = new Date().getTime();

        const response = await fetch('https://discord.com/api/v9/guilds/'+this.guildId+'/vanity-url', {
            "credentials": "include",
            "headers": {
                "accept": "*/*",
                "authorization": this.token,
                "Content-Type": "application/json",
            },
            "referrerPolicy": "no-referrer-when-downgrade",
            "body": JSON.stringify({
                "code": this.code
            }),
            "method": "PATCH",
            "mode": "cors"
        });
        const json = await response.json();
        
        if (json?.code === 50001 || json?.errors?.code?._errors[0]?.code === 'GUILD_INVALID_CODE' || json?.errors?.code?._errors[0]?.code || json?.code === 0) {
            return true;
        }

        if (json?.code === this?.code && !this.snipped) {
            this.accuracy = (new Date().getTime()) - startTime;

            return this.snipped = true;
        } else {
            if (json.retry_after) {
                console.log('\u001b[34mBy [RICK#0001] / \u001b[36mYou are being rate limited, Retry after '+this.getCooldown(Date.now() + json.retry_after)+'.')
            }
        }
    } 

    getCooldown = (cooldown) => {
        const time = parseInt(cooldown - Date.now());
        const pretty = this.prettyMs(time * 1000);
    
        return pretty;
    }
    
    pluralize = (word, count) => count === 1 ? word : `${word}s`;
    
    prettyMs = (milliseconds, options = {}) => {
        if (!Number.isFinite(milliseconds)) {
            throw new TypeError('Expected a finite number');
        }
    
        if (options.colonNotation) {
            options.compact = false;
            options.formatSubMilliseconds = false;
            options.separateMilliseconds = false;
            options.verbose = false;
        }
    
        if (options.compact) {
            options.secondsDecimalDigits = 0;
            options.millisecondsDecimalDigits = 0;
        }
    
        const result = [];
    
        const floorDecimals = (value, decimalDigits) => {
            const flooblueInterimValue = Math.floor((value * (10 ** decimalDigits)) + 0.0000001);
            const flooblueValue = Math.round(flooblueInterimValue) / (10 ** decimalDigits);
            return flooblueValue.toFixed(decimalDigits);
        };
    
        const add = (value, long, short, valueString) => {
            if ((result.length === 0 || !options.colonNotation) && value === 0 && !(options.colonNotation && short === 'm')) {
                return;
            }
    
            valueString = (valueString || value || '0').toString();
            let prefix;
            let suffix;
            if (options.colonNotation) {
                prefix = result.length > 0 ? ':' : '';
                suffix = '';
                const wholeDigits = valueString.includes('.') ? valueString.split('.')[0].length : valueString.length;
                const minLength = result.length > 0 ? 2 : 1;
                valueString = '0'.repeat(Math.max(0, minLength - wholeDigits)) + valueString;
            } else {
                prefix = '';
                suffix = options.verbose ? ' ' + this.pluralize(long, value) : short;
            }
    
            result.push(prefix + valueString + suffix);
        };
    
        const parsed = parseMilliseconds(milliseconds);
    
        function parseMilliseconds(milliseconds) {
            if (typeof milliseconds !== 'number') {
                throw new TypeError('Expected a number');
            }
    
            const roundTowardsZero = milliseconds > 0 ? Math.floor : Math.ceil;
    
            return {
                days: roundTowardsZero(milliseconds / 86400000),
                hours: roundTowardsZero(milliseconds / 3600000) % 24,
                minutes: roundTowardsZero(milliseconds / 60000) % 60,
                seconds: roundTowardsZero(milliseconds / 1000) % 60,
                milliseconds: roundTowardsZero(milliseconds) % 1000,
                microseconds: roundTowardsZero(milliseconds * 1000) % 1000,
                nanoseconds: roundTowardsZero(milliseconds * 1e6) % 1000
            };
        }
    
        add(Math.trunc(parsed.days / 365), 'année', 'y');
        add(parsed.days % 365, 'jour', 'd');
        add(parsed.hours, 'heure', 'h');
        add(parsed.minutes, 'minute', 'm');
    
        if (
            options.separateMilliseconds ||
            options.formatSubMilliseconds ||
            (!options.colonNotation && milliseconds < 1000)
        ) {
            add(parsed.seconds, 'seconde', 's');
            if (options.formatSubMilliseconds) {
                add(parsed.milliseconds, 'milliseconde', 'ms');
                add(parsed.microseconds, 'microseconde', 'µs');
                add(parsed.nanoseconds, 'nanoseconde', 'ns');
            } else {
                const millisecondsAndBelow =
                    parsed.milliseconds +
                    (parsed.microseconds / 1000) +
                    (parsed.nanoseconds / 1e6);
    
                const millisecondsDecimalDigits =
                    typeof options.millisecondsDecimalDigits === 'number' ?
                        options.millisecondsDecimalDigits :
                        0;
    
                const roundedMiliseconds = millisecondsAndBelow >= 1 ?
                    Math.round(millisecondsAndBelow) :
                    Math.ceil(millisecondsAndBelow);
    
                const millisecondsString = millisecondsDecimalDigits ?
                    millisecondsAndBelow.toFixed(millisecondsDecimalDigits) :
                    roundedMiliseconds;
    
                add(
                    Number.parseFloat(millisecondsString, 10),
                    'millisecond',
                    'ms',
                    millisecondsString
                );
            }
        } else {
            const seconds = (milliseconds / 1000) % 60;
            const secondsDecimalDigits =
                typeof options.secondsDecimalDigits === 'number' ?
                    options.secondsDecimalDigits :
                    1;
            const secondsFixed = floorDecimals(seconds, secondsDecimalDigits);
            const secondsString = options.keepDecimalsOnWholeSeconds ?
                secondsFixed :
                secondsFixed.replace(/\.0+$/, '');
            add(Number.parseFloat(secondsString, 10), 'seconde', 's', secondsString);
        }
    
        if (result.length === 0) {
            return '0' + (options.verbose ? ' milliseconds' : 'ms');
        }
    
        if (options.compact) {
            if (result.length >= 3) return result.slice(0, 2).join(' et ');
            else return result[0];
        }
    
        if (typeof options.unitCount === 'number') {
            const separator = options.colonNotation ? '' : ' ';
            return result.slice(0, Math.max(options.unitCount, 1)).join(separator);
        }
    
        return options.colonNotation ? result.join('') : result.join(' ');
    }
    
    sleep = (interval) => {
        return new Promise(resolve => setTimeout(resolve, interval))
    }
    
    get token() {
        if (this.tokenPosition > this.tokens.length - 1) this.tokenPosition = 0;
        const token = this.tokens[this.tokenPosition];
        this.tokenPosition++;
    
        return token;
    }
    
    get time() {
        return require("moment-timezone").tz(Date.now(), "Europe/Paris").format("HH:mm:ss");
    }
    
    }
    