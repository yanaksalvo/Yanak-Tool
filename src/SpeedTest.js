const fetch = require("node-fetch");

class SpeedTest {
    constructor () {
        console.clear()
        console.log('\u001b[34m | \nto buy please enter the discord: https://discord.gg/ajkzDGSMg2\n\n\u001b[0m')
        this.ping()
    }
    
    ping = async () => {
        while (true) {
            let startTime = new Date().getTime();

            fetch('https://discord.com/api/v9/gateway').then(response => {
                if (response.ok) {
                    let endTime = new Date().getTime();
                    let latency = endTime - startTime;
                    console.log(`\x1b[44m » SPEEDTEST :\x1b[0m Latency \x1b[1;32m${Math.floor(latency/3)/100}s\x1b[0m`);
                }
            }).catch(error => console.error('Error:', error));

            await this.sleep(2000)
        }
    }

    sleep = (interval) => {
        return new Promise(resolve => setTimeout(resolve, interval))
    }
}

module.exports = SpeedTest