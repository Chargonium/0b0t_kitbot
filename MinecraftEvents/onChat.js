const { commandEmitter, Admins, registerCommands, log } = require('../index')

module.exports = {
    name: "chat",
    once: false,
    execute(username, message, translate, jsonMsg, matches) {
        /*
        let commandString = message.slice(1) + " "
        let command = commandString.substring(0, commandString.indexOf(" ")).toLowerCase()
        if (command == "reloadcommands") {
            if (!Admins.includes(username)) return
            commandEmitter.removeAllListeners()
            registerCommands()
            return
        }
        let argsString = commandString.slice(commandString.indexOf(" ")+1)
        let args = argsString.split(' ')
        commandEmitter.emit(command, username, args, argsString)
        log("Command Usage", `${username} has (tried) to use: \`${command} ${argsString}\``, "#1111ff")*/
    }
}