const fetch = require("node-fetch"),
      setTitle = require('console-title');

class rateLimit {
    constructor(options) {
        console.clear();
        console.log('\u001b[34m https://discord.gg/ajkzDGSMg2 \n\n\x1b[0m')

        if (!options?.RateLimitToken || !options?.RateLimitGuildID) {
            console.log(`\x1b[41m » RATELIMIT :\x1b[0m Config file missing something.\x1b[0m`);    
            return false;
        }

        setTitle('Vanity Sniper V15 /  / https://discord.gg/ajkzDGSMg2 / RateLimit Checker.');

        this.token = options.RateLimitToken
        this.guildId = options.RateLimitGuildID

        this.start()
    }

    start = async () => {
        while (true) {
            
            let response = await this.checkRateLimit();
            let resault = await response.json();

            console.clear();
            console.log('\u001b[34mYANAK | YANAK\nto buy please enter the discord: https://discord.gg/ajkzDGSMg2\n\n\x1b[0m');

            if (resault?.retry_after) {
                console.log(`\x1b[41m » RATELIMIT CHECKER :\x1b[0m Youre being rate limited for ${this.getCooldown(Date.now() + resault?.retry_after)}.`);
            } else if (response?.status === 401 || response?.status === 403) {
                console.log(`\x1b[41m » RATELIMIT CHECKER :\x1b[0m Invalid or expired token.`);
            } else if (response?.status !== 429){
                console.log(`\x1b[42m » RATELIMIT CHECKER :\x1b[0m There is no rate limit.`);
            } else {
                console.log(`\x1b[48;5;202m » RATELIMIT CHECKER :\x1b[0m Something went wrong.`);
            }
                        
            await this.sleep(1000);
        }
    }

    checkRateLimit = async () => {
        const response = await fetch(`https://discord.com/api/v9/guilds/${this.guildId}/vanity-url`, {
            "credentials": "include",
            "headers": {
                "accept": "*/*",
                "authorization": this.token,
                "Content-Type": "application/json",
            },
            "referrerPolicy": "no-referrer-when-downgrade",
            "body": JSON.stringify({
                "code": '11'
            }),
            "method": "PATCH",
            "mode": "cors"
        });

        return response;
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
}


module.exports = rateLimit