"use strict";
const fetch = require("node-fetch");

module.exports = class testWebhook {
    constructor(options) {
        if (options?.webhookTesterUrl) {
            this.webhookTesterUrl = options?.webhookTesterUrl

            this.start()
        } else {
            console.clear()
            console.log('\u001b[34mhttps://discord.gg/ajkzDGSMg2 | Yanak\\n\n\u001b[0m')
            console.log(`\x1b[41m » Yanak:\x1b[0m Config file missing something.\x1b[0m`);
            return false;
        }
    }

    async start() {

        const embed = {
            title: 'Working ..',
            description: '`Your Webhook Status : Working`',
            footer: { text: 'I-F', },
            image: { url: 'https://cdn.discordapp.com/attachments/1060915817975386202/1197718558348673024/Great_Military_Soldier_Animated_Gifs.gif?ex=65bc4954&is=65a9d454&hm=506428862aaf51a4f5c0f449b347627c45f7436061253f64349aaaefab9a47fa&', },
        };

        await fetch(this.webhookTesterUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "content": "@everyone",
                "embeds": [embed],
                "attachments": []
            })
        })
        .then(res => {if (res.ok) {console.log('Message was sent successfully.')} else {console.log('An error has occurred: ', res.statusText ?? 'Unknown')}})
        .catch(err => console.log('An error has occurred: ', err));
    }
}