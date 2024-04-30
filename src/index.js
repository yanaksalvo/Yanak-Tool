const readline = require('readline'),
    fs = require('fs'),
    setTitle = require('console-title');

let rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const createInterface = async (config) => {

    console.clear();

    setTitle('Vanity Sniper Yanak / YANAK / https://discord.gg/ajkzDGSMg2');

    let lines = fs.readFileSync('./config/Main-Config.txt', 'utf8').split('\n');
    let jsonObject = {};

    lines.forEach(line => {
        let keyValue = line.split('=');
        if (keyValue.length >= 1) {
            jsonObject[keyValue[0].trim()] = (keyValue[1] ?? ' -- ').split('--')[0].trim();
        }
    });

    let _data = JSON.parse(JSON.stringify(jsonObject, null, 2));

    let string = '';
    for (const key in config) {
        string += `\x1b[91m${key})\x1b[0m \x1b[31m${config[key].name}\x1b[0m\n`;
    }

    console.log('\x1b[36mYanak | Yanak\n\x1b[35mTo Buy Please Enter The Discord : https://discord.gg/ajkzDGSMg2')

    rl.question('\x1b[34m\n\n\x1b[31m' + string + '\x1b[0m', async (answer) => {

        let data = config[+answer];

        if (!data) return createInterface(config);

        if (+answer === 1) new (require('./AutoClaimer.js'))(_data);
        if (+answer === 2) new (require('./Swapper.js'))(_data);
        if (+answer === 3) new (require('./RateLimit.js'))(_data);
        if (+answer === 4) new (require('./SpeedTest.js'))(_data);
        if (+answer === 5) new (require('./wehbhooktest.js'))(_data);

        rl.close();
    });
}

createInterface({
    1: { name: 'AutoClaimer' },
    2: { name: 'Swapper' },
    3: { name: 'Rate limit' },
    4: { name: 'Speedtest' },
    5: { name: 'Webhook Test' },
    6: { name: 'Turbo Tool' },
    7: { name: 'Spammer' },
})
