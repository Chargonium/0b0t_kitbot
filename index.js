const Mineflayer = require('mineflayer')
const { pathfinder } = require('mineflayer-pathfinder')
const { EmbedBuilder, Client, Events, GatewayIntentBits } = require(`discord.js`)
const fs = require('node:fs');
const path = require('node:path');
const https = require('https');
const { EventEmitter } = require('node:events');

const botObject = {bot: null}

let commandEmitter = new EventEmitter()

let client = null

mcdata = null

const Admins = [
    "34fb485c844343878718b12337430249", // Chargonium
]

const Blacklisted = []

function waitForNonNullChat(interval = 100) {
    return new Promise((resolve) => {
      const checkVariable = () => {
        if (botObject.bot.chat != null) {
          resolve(null);
        } else {
          setTimeout(checkVariable, interval);
        }
      };
  
      checkVariable();
    });
}

function waitForNonNullClientChat(interval = 100) {
    return new Promise((resolve) => {
      const checkVariable = () => {
        if (botObject.bot._client.chat != null) {
          resolve(null);
        } else {
          setTimeout(checkVariable, interval);
        }
      };
  
      checkVariable();
    });
}

function waitForNonNullBot(interval = 100) {
    return new Promise((resolve) => {
      const checkVariable = () => {
        if (botObject.bot != null) {
            waitForNonNullChat(1).then(() => {
                waitForNonNullClientChat(1).then(() => {
                    resolve(botObject.bot)
                })
            })
        } else {
          setTimeout(checkVariable, interval);
        }
      };
  
      checkVariable();
    });
}

function processEnv() {
    return new Promise((resolve) => {
        const dotenv = require('dotenv')
        dotenv.config()
        resolve(null)
    })
}

async function getPlayerData(uuid) {
    return new Promise(async (resolve) => {
        let data = ''
        const request = https.request({
        hostname: "sessionserver.mojang.com",
        path: `/session/minecraft/profile/${uuid}`,
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        }
        }, (response) => {
        response.setEncoding('utf-8')

        response.on('data', (chunk) => {
            data += chunk
        })

        response.on('end', async () => {
            resolve(JSON.parse(data))
        })
        })
        request.on('error', async (error) => {
            log("Error", error, "#ff1111")
        })

        request.end();
    })
}

async function getUuid(username) {
    return new Promise(async (resolve) => {
        const options = {method: 'GET', headers: {'User-Agent': 'insomnia/10.0.0'}};

        fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`, options)
            .then(response => response.json())
            .then(response => resolve(response["id"]))
            .catch(err => console.error(err));
    })
}

function CreateBot() {
    log("Information", "Creating the minecraft bot!")
    let serverHost = process.env.IP.split(":")
    botObject.bot = Mineflayer.createBot({
        host: serverHost[0],
        port: serverHost[1],
        username: process.env.MC_EMAIL,
        password: process.env.MC_PASSWORD,
        auth: 'microsoft',
        version: '1.12.2' // Even though 0b0t is 1.20.4 as of right now; For whatever reason if i try using 1.20.4 for the bot breaks ):
    })
    
}

function InitDiscordBot() {
    return new Promise((resolve) => {
        client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages] });
        const eventsPath = path.join(__dirname, 'DiscordEvents');
        const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

        for (const file of eventFiles) {
            const filePath = path.join(eventsPath, file);
            const event = require(filePath);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args));
            } else {
                client.on(event.name, (...args) => event.execute(...args));
            }
        }
        client.login(process.env.BOTTOKEN)
        client.once(Events.ClientReady, () => {
            resolve()
        })
    })
}

async function registerListeners() {
    const eventsPath = path.join(__dirname, 'MinecraftEvents');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        if (event.once) {
            botObject.bot.once(event.name, (...args) => event.execute(...args));
        } else {
            botObject.bot.on(event.name, (...args) => event.execute(...args));
        }
    }
}

async function registerCommands() {
    const eventsPath = path.join(__dirname, 'commands');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        if (event.once) {
            commandEmitter.once(event.name, (...args) => event.execute(...args));
        } else {
            commandEmitter.on(event.name, (...args) => event.execute(...args));
        }
    }
}

async function InitBot() {
    await processEnv()
    await InitDiscordBot()

    CreateBot()
    log("Information", "Loading the bot plugins!")
    botObject.bot.loadPlugin(pathfinder)
    log("Information", "Registering the bot listeners!")
    registerListeners()
    log("Information", "Registering the command listeners!")
    registerCommands()
}

async function Main() {
    InitBot()
}

function log(type = "Debug",  message = "UNDEFINED", color = "#2e2e2e") {
    const embed = new EmbedBuilder()
        .setTitle(type)
        .setColor(color)
        .setDescription(message)
        .setTimestamp()
    client.channels.cache.get(process.env.DEBUGCHANNEL).send({ embeds: [embed] })
}

Main()

module.exports = {
	sendChat(message) {
        botObject.bot.chat(message)
    },
    getPlayerData, getUuid,
    sendMessage(channelID, message) {
        client.channels.cache.get(channelID).send(message)
    },
    log,
    commandEmitter,
    botObject,
    Admins, Blacklisted,
    registerCommands,
    waitForNonNullBot
}