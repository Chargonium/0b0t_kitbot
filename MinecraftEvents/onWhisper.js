const { commandEmitter, Admins, registerCommands, log, getUuid } = require('../index')

module.exports = {
    name: "whisper",
    once: false,
    async execute(username, message, translate, jsonMsg, matches) {
        let commandString = message.slice(1) + " "
        let command = commandString.substring(0, commandString.indexOf(" ")).toLowerCase()
        var uuid = await getUuid(username)
        var isAdmin = Admins.includes(uuid)
        if (command == "reloadcommands") {
            if (!isAdmin) return
            commandEmitter.removeAllListeners()
            registerCommands()
            return
        }
        let argsString = commandString.slice(commandString.indexOf(" ")+1)
        let args = argsString.split(' ')
        log("Command Usage", `${username} has (tried) to use: \`${command} ${argsString}\``, "#1111ff")
        commandEmitter.emit(command, username, args, argsString, isAdmin)
    }
}