let { botObject } = require("../index")

module.exports = {
    name: "spawn",
    once: true,
    execute() {
        botObject.bot.setControlState('jump', true)
        botObject.bot.waitForTicks(10)
        botObject.bot.setControlState('jump', false)
    }
}