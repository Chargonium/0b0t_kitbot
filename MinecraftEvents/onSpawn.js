let { botObject, log, sendChat, waitForNonNullBot } = require("../index")

module.exports = {
    name: "spawn",
    once: true,
    execute() {
        log("Debug", "omg it actually fucking ran")
        waitForNonNullBot().then((bot) => {
            bot.setControlState('jump', true)
            setTimeout(() => {
                bot.setControlState('jump', false)
            }, 500)
        })
    }
}