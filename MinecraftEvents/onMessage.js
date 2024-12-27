const { Admins, botObject, getUuid, log } = require('../index')

const tpa = /[A-Za-z0-9]+ wants to teleport to you, \[ACCEPT\] or \[DENY\] or \[IGNORE\]/i;

module.exports = {
    name: "messagestr",
    once: false,
    execute(message, messagePosition, jsonMsg, sender, verified) {
        
        if (tpa.test(message)) {
            var username = message.split(" ")[0]
            getUuid(username).then((uuid) => {
                if (Admins.includes(uuid)) {
                    botObject.bot.chat(`/tpy ${username}`)
                    log("Tpa Request", `${username} Successfully tpa'd!`, "#11ff11")
                } else {
                    botObject.bot.chat(`/tpn ${username}`)
                    log("Tpa Request", `${username} Tried to tpa, but failed!`, "#ff1111")
                }
            })
        } 
    }
}