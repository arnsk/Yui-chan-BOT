const { create } = require('@open-wa/wa-automate')
const { color } = require('./util')
const clientOptions = require('./util').options
const msgHandler = require('./handler/message')

const startServer = () => {
    create('Imperial', clientOptions(true))
        .then((client) => {
            console.log('[DEV]', color('Red Emperor', 'yellow'))
            console.log('[CLIENT] CLIENT Started!')

            // Force it to keep the current session
            client.onStateChanged((state) => {
                console.log('[Client State]', state)
                if (state === 'CONFLICT') client.forceRefocus()
            })

            // listening on message
            client.onMessage((message) => {
                client.getAmountOfLoadedMessages() // Cut message Cache if cache more than 3K
                    .then((msg) => {
                        if (msg >= 3000) {
                            console.log('[CLIENT]', color(`Loaded Message Reach ${msg}, cuting message cache...`, 'yellow'))
                            client.cutMsgCache()
                        }
                    })
                // Message Handler
                msgHandler(client, message)
            })

            // listen group invitation
            client.onAddedToGroup(({ groupMetadata: { id }, contact: { name } }) =>
                client.getGroupMembersId(id)
                    .then((ids) => {
                        console.log('[CLIENT]', color(`Invited to Group. [ ${name} : ${ids.length}]`, 'yellow'))
                        // conditions if the group members are less than 10 then the bot will leave the group
                        if (ids.length <= 5) {
                            client.sendText(id, 'Desculpe, o mininmo é de 5 usuarios Bye~').then(() => client.leaveGroup(id))
                        } else {
                            client.sendText(id, `Olá amgios *${name}*, obrigado por adicionar esse bot, para ver o menu do bot digite *#menu*`)
                        }
                    }))

            // listen paricipant event on group (wellcome message)
            // client.onGlobalParicipantsChanged((event) => {
            //     if (event.action === 'add') client.sendTextWithMentions(event.chat, `Hello, Welcome to the group @${event.who.replace('@c.us', '')} \n\nHave fun with us✨`)
            // })
        })
        .catch((err) => new Error(err))
}

startServer()
