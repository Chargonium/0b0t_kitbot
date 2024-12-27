const { sendMessage, botObject } = require('../index')

module.exports = {
    name: "chat",
    once: false,
    execute(username, message, translate, jsonMsg, matches) {
        while (botObject == null) {}
        if (username == botObject.bot.username) return
        sendMessage(process.env.BRIDGECHANNEL, `[${username}] ${message}`)
    }
}