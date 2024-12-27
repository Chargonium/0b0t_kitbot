let {botObject} = require("../index")


module.exports = {
    name: "messageCreate",
    once: false,
    execute(message) {
        if (message.author.bot) return false

        if (message.channelId != process.env.BRIDGECHANNEL) return false
        while (botObject == null) {}

        botObject.bot.chat(`! [${message.author.username}] ${message.content}`)
    }
}