const { sendChat, log } = require("..")

module.exports = {
    name: "kys",
    once: false,
    execute(username, args, argsString, isAdmin) {
        if (!isAdmin) return
        sendChat("/kill")
        log("Info", "Someone made me kill myself )::", "#FF8800")
        sendChat(`/r ok ):`)
    }
}