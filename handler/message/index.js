const { decryptMedia } = require('@open-wa/wa-automate')
const { downloader, cekResi, removebg, urlShortener, meme } = require('../../lib')
const fs = require('fs-extra')
const { msgFilter, color, mentionList } = require('../../util')
const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta').locale('id')

const { menuId, menuEn } = require('./text') // Indonesian & English menu

module.exports = msgHandler = async (client, message) => {
    try {
        const { type, id, from, t, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg, quotedMsgObj, mentionedJidList } = message
        let { body } = message
        const { name, formattedTitle } = chat
        let { pushname, verifiedName, formattedName } = sender
        pushname = pushname || verifiedName || formattedName // verifiedName is the name of someone who uses a business account
        if (pushname == undefined || pushname.trim() == '') console.log(sender)
        const botNumber = await client.getHostNumber() + '@c.us'
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
        const groupMembers = isGroupMsg ? await client.getGroupMembersId(groupId) : ''
        const isGroupAdmins = groupAdmins.includes(sender.id) || false
        const isBotGroupAdmins = groupAdmins.includes(botNumber) || false

        // Checking processTime
        const processTime = now => moment.duration(now - moment(t * 1000)).asSeconds() // t => timestamp when message was received
        const prefix = ''
        body = (type === 'chat' && body.startsWith(prefix)) ? body : ((type === 'image' && caption) && caption.startsWith(prefix)) ? caption : ''
        const command = body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase()
        const args = body.slice(prefix.length).trim().split(/ +/).slice(1)
        const isCmd = body.startsWith(prefix)
        const uaOverride = 'WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
        const url = args.length !== 0 ? args[0] : ''
        const isUrl = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi)
        if (!isCmd && !isGroupMsg) { return console.log('[RECV]', color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), 'Mensagem de ', color(pushname)) }
        if (!isCmd && isGroupMsg) { return console.log('[RECV]', color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), 'Mensagem de ', color(pushname), 'em', color(name || formattedTitle)) }
        if (isCmd && !isGroupMsg) { console.log(color('[EXEC]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'de', color(pushname)) }
        if (isCmd && isGroupMsg) { console.log(color('[EXEC]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'de', color(pushname), 'em', color(name || formattedTitle)) }
        switch (command) {
        // Menu and TnC
        case '#speed':
            await client.sendText(from, `Speed: ${processTime(moment())} _Second_`)
            break
        case '#tnc':
            await client.sendText(from, menuId.textTnC())
            break
        case '#menu':
        case '#help':
        case '!menu':
        case '@comandos':
        case '#comandos':
            await client.sendText(from, menuId.textMenu(pushname))
                .then(() => ((isGroupMsg) && (isGroupAdmins)) ? client.sendText(from, 'Menu Admin Grup: *#menuadmin*') : null)
            break
        case '#menuadmin':
        case '#menuadm':
            if (!isGroupMsg) return client.reply(from, 'Desculpe, este comando só pode ser usado dentro do grupo! [Group Only]', id)
            if (!isGroupAdmins) return client.reply(from, 'Falha, este comando só pode ser usado por administradores de grupo! [Admin Group Only]', id)
            await client.sendText(from, menuId.textAdmin())
            break
        case 'donate':
        case 'donasi':
            await client.sendText(from, menuId.textDonasi())
            break
        // Sticker Creator
        case 'sticker':
        case '#sticker':
        case 'stiker': {
            const isQuotedImage = quotedMsg && quotedMsg.type === 'image'
            if (isMedia && args.length === 0) {
                const mediaData = await decryptMedia(message, uaOverride)
                const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                client.sendImageAsSticker(from, imageBase64)
                    .then(() => client.reply(from, `aqui seu sticker \n\nProcessado em ${processTime(moment())} _Second_`))
            } else if (isQuotedImage && args.length === 0) {
                const mediaData = await decryptMedia(quotedMsg, uaOverride)
                const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                client.sendImageAsSticker(from, imageBase64)
                    .then(() => client.reply(from, `aqui seu sticker \n\nProcessado em ${processTime(moment())} _Second_`))
            } else if (args[0] === 'nobg') {
                client.reply(from, 'ehhh o que foi isso???', id)
            } else if (args.length === 1) {
                if (!url.match(isUrl)) { await client.reply(from, 'Desculpe, o link que você enviou é inválido. [Invalid Link]', id) }
                client.sendStickerfromUrl(from, url)
                    .then(() => client.reply(from, `Aqui seu sticker \n\nProcessado em ${processTime(moment())} _Second_`))
                    .then((r) => (!r && r !== undefined) ? client.sendText(from, 'Desculpe, o link que você enviou não contém uma imagem. [No Image]') : null)
            } else {
                await client.reply(from, 'Sem imagem! Para abrir uma lista de comandos, envie #menu [Wrong Format]', id)
            }
            break
        }
        // Video Downloader
        case '#tiktok':
            if (args.length !== 1) return client.reply(from, 'Desculpe, o formato da mensagem está errado, verifique o menu. [Wrong Format]', id)
            if (!url.match(isUrl) && !url.includes('tiktok.com')) return client.reply(from, 'Desculpe, o link que você enviou é inválido. [Invalid Link]', id)
            await client.reply(from, '_Scraping Metadata..._ \n\nObrigado por usar este bot, você pode ajudar no desenvolvimento deste bot perguntando através de https://saweria.co/donate/yogasakti ou https://trakteer.id/red-emperor \nTerimakasih.', id)
            downloader.tiktok(url)
                .then(async (videoMeta) => {
                    const filename = videoMeta.authorMeta.name + '.mp4'
                    const caps = `*Metadata:*\nUsername: ${videoMeta.authorMeta.name} \nMusic: ${videoMeta.musicMeta.musicName} \nView: ${videoMeta.playCount.toLocaleString()} \nLike: ${videoMeta.diggCount.toLocaleString()} \nComment: ${videoMeta.commentCount.toLocaleString()} \nShare: ${videoMeta.shareCount.toLocaleString()} \nCaption: ${videoMeta.text.trim() ? videoMeta.text : '-'}\n\nProcessed for ${processTime(moment())} _Second_`
                    await client.sendFileFromUrl(from, videoMeta.url, filename, videoMeta.NoWaterMark ? caps : `⚠ Vídeos sem marca d/'água não estão disponíveis. \n\n${caps}`, '', { headers: { 'User-Agent': 'okhttp/4.5.0' } }, true)
                        .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized}`)).catch((err) => console.error(err))
                }).catch(() => {
                    client.reply(from, 'Falha ao recuperar metadados, o link que você enviou é inválido. [Invalid Link]', id)
                })
            break
        case '#ig':
        case '#instagram':
            if (args.length !== 1) return client.reply(from, 'Desculpe, o formato da mensagem está errado, verifique o menu. [Wrong Format]', id)
            if (!url.match(isUrl) && !url.includes('instagram.com')) return client.reply(from, 'Desculpe, o link que você enviou é inválido. [Invalid Link]', id)
            await client.reply(from, '_Scraping Metadata..._ \n\nObrigado por usar este bot, você pode ajudar no desenvolvimento deste bot perguntando através de https://saweria.co/donate/yogasakti ou https://trakteer.id/red-emperor \nTerimakasih.', id)
            downloader.insta(url)
                .then(async (data) => {
                    if (data.type == 'GraphSidecar') {
                        if (data.image.length != 0) data.image.map((x) => client.sendFileFromUrl(from, x, 'photo.jpg', `[ Processed for ${processTime(moment())} _Second_ ]`, null, null, true)).then((serialized) => console.log(`Envio de arquivos com sucesso com id: ${serialized}`)).catch((err) => console.error(err))
                        if (data.video.length != 0) data.video.map((x) => client.sendFileFromUrl(from, x.videoUrl, 'video.jpg', `[ Processed for ${processTime(moment())} _Second_ ]`, null, null, true)).then((serialized) => console.log(`Envio de arquivos com sucesso com id: ${serialized}`)).catch((err) => console.error(err))
                    } else if (data.type == 'GraphImage') {
                        await client.sendFileFromUrl(from, data.image, 'photo.jpg', `[ Processed for ${processTime(moment())} _Second_ ]`, null, null, true)
                            .then((serialized) => console.log(`Envio de arquivos com sucesso com id: ${serialized}`)).catch((err) => console.error(err))
                    } else if (data.type == 'GraphVideo') {
                        await client.sendFileFromUrl(from, data.video.videoUrl, 'video.mp4', `[ Processed for ${processTime(moment())} _Second_ ]`, null, null, true)
                            .then((serialized) => console.log(`Envio de arquivos com sucesso com id: ${serialized}`)).catch((err) => console.error(err))
                    }
                })
                .catch((err) => {
                    if (err === 'Not a video') { return client.reply(from, 'Erro, não há vídeo no link que você enviou. [Invalid Link]', id) }
                    client.reply(from, 'Error, user link privado ou errado [Private or Invalid Link]', id)
                })
            break
        case '#twt':
        case '#twitter':
            if (args.length !== 1) return client.reply(from, 'Desculpe, o formato da mensagem está errado, verifique o menu. [Wrong Format]', id)
            if (!url.match(isUrl) & !url.includes('twitter.com') || url.includes('t.co')) return client.reply(from, 'Desculpe, o url que você enviou é inválido. [Invalid Link]', id)
            await client.reply(from, '_Scraping Metadata..._ \n\nObrigado por usar este bot, você pode ajudar no desenvolvimento deste bot perguntando através de https://saweria.co/donate/yogasakti ou https://trakteer.id/red-emperor \nTerimakasih.', id)
            downloader.tweet(url)
                .then(async (data) => {
                    if (data.type === 'video') {
                        const content = data.variants.filter(x => x.content_type !== 'application/x-mpegURL').sort((a, b) => b.bitrate - a.bitrate)
                        const result = await urlShortener(content[0].url)
                        console.log('Shortlink: ' + result)
                        await client.sendFileFromUrl(from, content[0].url, 'video.mp4', `Link Download: ${result} \n\nProcessed for ${processTime(moment())} _Second_`, null, null, true)
                            .then((serialized) => console.log(`Envio de arquivos com sucesso com id: ${serialized}`)).catch((err) => console.error(err))
                    } else if (data.type === 'photo') {
                        for (let i = 0; i < data.variants.length; i++) {
                            await client.sendFileFromUrl(from, data.variants[i], data.variants[i].split('/media/')[1], '', null, null, true)
                                .then((serialized) => console.log(`Envio de arquivos com sucesso com id: ${serialized}`)).catch((err) => console.error(err))
                        }
                    }
                })
                .catch(() => client.sendText(from, 'Desculpe, o link é inválido ou não há mídia no link que você enviou. [Invalid Link]'))
            break
        case '#fb':
        case '#facebook':
            if (args.length !== 1) return client.reply(from, 'Desculpe, o formato da mensagem está errado, verifique o menu. [Wrong Format]', id)
            if (!url.match(isUrl) && !url.includes('facebook.com')) return client.reply(from, 'Desculpe, o url que você enviou é inválido. [Invalid Link]', id)
            await client.reply(from, '_Scraping Metadata..._ \n\nObrigado por usar este bot, você pode ajudar no desenvolvimento deste bot perguntando através de https://saweria.co/donate/yogasakti ou https://trakteer.id/red-emperor \nTerimakasih.', id)
            downloader.facebook(url)
                .then(async (videoMeta) => {
                    const title = videoMeta.response.title
                    const thumbnail = videoMeta.response.thumbnail
                    const links = videoMeta.response.links
                    const shorts = []
                    for (let i = 0; i < links.length; i++) {
                        const shortener = await urlShortener(links[i].url)
                        console.log('Shortlink: ' + shortener)
                        links[i].short = shortener
                        shorts.push(links[i])
                    }
                    const link = shorts.map((x) => `${x.resolution} Quality: ${x.short}`)
                    const caption = `Text: ${title} \n\nLink Download: \n${link.join('\n')} \n\nProcessed for ${processTime(moment())} _Second_`
                    await client.sendFileFromUrl(from, thumbnail, 'videos.jpg', caption, null, null, true)
                        .then((serialized) => console.log(`Envio de arquivos com sucesso com id: ${serialized}`)).catch((err) => console.error(err))
                })
                .catch((err) => client.reply(from, `Error, URL inválido ou vídeo não carregado. [Invalid Link or No Video] \n\n${err}`, id))
            break
        // Other Command
        case '#mim':
        case '#memes':
        case '#meme':
        case 'meme':
            meme().then(({ title, url }) => client.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`, null, null, true))
            break
        case 'resi':
            if (args.length !== 2) return client.reply(from, 'Desculpe, o formato da mensagem está errado, verifique o menu. [Wrong Format]', id)
            const kurirs = ['jne', 'pos', 'tiki', 'wahana', 'jnt', 'rpx', 'sap', 'sicepat', 'pcp', 'jet', 'dse', 'first', 'ninja', 'lion', 'idl', 'rex']
            if (!kurirs.includes(args[0])) return client.sendText(from, `O tipo de expedição de frete não é compatível. Este serviço só oferece suporte para expedição de frete ${kurirs.join(', ')} Por favor cheque novamente.`)
            console.log('Verifique o No. do recibo', args[1], 'por expedição', args[0])
            cekResi(args[0], args[1]).then((result) => client.sendText(from, result))
            break
        case '#cat':
        case '#cats':
        case '#kitten':
            cat().then(({ title, url }) => client.sendFileFromUrl(from, `${url}`, 'cat.jpg', `${title}`, null, null, true))
            break
        case '#waifu':
        case '#waifus':
        case 'waifu':
            waifu().then(({ title, url }) => client.sendFileFromUrl(from, `${url}`, 'waifu.jpg', `${title}`, null, null, true))
            break      
        case '#futa':
        case 'futa':
        case '#futanari':
            futa().then(({ title, url }) => client.sendFileFromUrl(from, `${url}`, 'futa.jpg', `${title}`, null, null, true))
            break 
        case '#hentai':
        case '#hentais':
            hentai().then(({ title, url }) => client.sendFileFromUrl(from, `${url}`, 'hentai.jpg', `${title}`, null, null, true))
            break          
        case '#ping':
            client.reply(from, 'pong!', id)
            break      
        case '#wallpaper':
        case '#wallpapers':
            wallpaper().then(({ title, url }) => client.sendFileFromUrl(from, `${url}`, 'wallpaper.jpg', `${title}`, null, null, true))
            break
        case '#infogrupo':
            const grpic = await client.getProfilePicFromServer(chat.id)
            const groupchat = await client.getChatById(from)
            const {
                desc
            } = groupchat.groupMetadata

            if (grpic == undefined) {
                var gp1 = errorurl
            } else {
                var gp1 = grpic
            }
            await client.sendFileFromUrl(from, gp1, 'grp.png', '*' + name + '*\n\n Description:\n ' + `${desc}`)
            break      
        // Group Commands (group admin only)
        case '#kick':
            if (!isGroupMsg) return client.reply(from, 'Desculpe, este comando só pode ser usado dentro do grupo! [Group Only]', id)
            if (!isGroupAdmins) return client.reply(from, 'Falha, este comando só pode ser usado por administradores de grupo! [Admin Group Only]', id)
            if (!isBotGroupAdmins) return client.reply(from, 'Falha, adicione o bot como administrador do grupo! [Bot Not Admin]', id)
            if (mentionedJidList.length === 0) return client.reply(from, 'Desculpe, o formato da mensagem está errado, verifique o menu. [Wrong Format]', id)
            if (mentionedJidList[0] === botNumber) return await client.reply(from, 'Desculpe, o formato da mensagem está errado, verifique o menu. [Wrong Format]', id)
            await client.sendTextWithMentions(from, `Pedido recebido, emitido:\n${mentionedJidList.map(x => `@${x.replace('@c.us', '')}`).join('\n')}`)
            for (let i = 0; i < mentionedJidList.length; i++) {
                if (groupAdmins.includes(mentionedJidList[i])) return await client.sendText(from, 'Falha, você não pode remover o administrador do grupo.')
                await client.removeParticipant(groupId, mentionedJidList[i])
            }
            break
        case '#promote':
            if (!isGroupMsg) return await client.reply(from, 'Desculpe, este comando só pode ser usado dentro do grupo! [Group Only]', id)
            if (!isGroupAdmins) return await client.reply(from, 'Falha, este comando só pode ser usado por administradores de grupo! [Admin Group Only]', id)
            if (!isBotGroupAdmins) return await client.reply(from, 'Falha, adicione o bot como administrador do grupo! [Bot not Admin]', id)
            if (mentionedJidList.length != 1) return client.reply(from, 'Desculpe, o formato da mensagem está errado, verifique o menu. [Wrong Format, Only 1 user]', id)
            if (groupAdmins.includes(mentionedJidList[0])) return await client.reply(from, 'Desculpe, o usuário já é um administrador. [Bot is Admin]', id)
            if (mentionedJidList[0] === botNumber) return await client.reply(from, 'Desculpe, o formato da mensagem está errado, verifique o menu. [Wrong Format]', id)
            await client.promoteParticipant(groupId, mentionedJidList[0])
            await client.sendTextWithMentions(from, `Request diterima, menambahkan @${mentionedJidList[0].replace('@c.us', '')} sebagai admin.`)
            break
        case '#demote':
            if (!isGroupMsg) return client.reply(from, 'Desculpe, este comando só pode ser usado dentro do grupo! [Group Only]', id)
            if (!isGroupAdmins) return client.reply(from, 'Falha, este comando só pode ser usado por administradores de grupo! [Admin Group Only]', id)
            if (!isBotGroupAdmins) return client.reply(from, 'Falha, adicione o bot como administrador do grupo! [Bot not Admin]', id)
            if (mentionedJidList.length !== 1) return client.reply(from, 'Desculpe, o formato da mensagem está errado, verifique o menu. [Wrong Format, Only 1 user]', id)
            if (!groupAdmins.includes(mentionedJidList[0])) return await client.reply(from, 'Desculpe, o usuário não é um administrador. [user not Admin]', id)
            if (mentionedJidList[0] === botNumber) return await client.reply(from, 'Desculpe, o formato da mensagem está errado, verifique o menu. [Wrong Format]', id)
            await client.demoteParticipant(groupId, mentionedJidList[0])
            await client.sendTextWithMentions(from, `Pedido aceito, remover posição @${mentionedJidList[0].replace('@c.us', '')}.`)
            break
        case '#sair':
            if (!isGroupMsg) return client.reply(from, 'Desculpe, este comando só pode ser usado dentro do grupo! [Group Only]', id)
            if (!isGroupAdmins) return client.reply(from, 'Falha, este comando só pode ser usado por administradores de grupo! [Admin Group Only]', id)
            client.sendText(from, 'Good bye... ( ⇀‸↼‶ )').then(() => client.leaveGroup(groupId))
            break
        case '#del':
            if (!isGroupAdmins) return client.reply(from, 'Falha, este comando só pode ser usado por administradores de grupo! [Admin Group Only]', id)
            if (!quotedMsg) return client.reply(from, 'Desculpe, o formato da mensagem está errado, verifique o menu. [Wrong Format]', id)
            if (!quotedMsgObj.fromMe) return client.reply(from, 'Desculpe, o formato da mensagem está errado, verifique o menu. [Wrong Format]', id)
            client.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false)
                .then(() => client.reply(from, 'Mensagens excluídas com sucesso. [Deleted]', id))
            break
        case 'pika':
        case 'pau':
            client.reply(from, 'ehhh, o que é isso ???', id)
            break
        case 'yui':
        case 'yui-chan':
        case 'yuui':
        case 'yui-chan':
            client.reply(from, 'F-falou cmg ??')
            client.reply(from, 'Ac-cho que sim :3')
            break
        case 'para':
            client.reply(from, 'Paro nada n, ta doido?')
            break
        case 'teamo':
        case 'amo':
            client.reply(from, 'ee--h vc me ama? senpai')
            break
        case 'tamilis':
        case 'tata':
        case 'tamires':
            client.reply(from, 'Tamilis Tamilis')
            break
        case 'mamãe':
            client.reply(from, 'Minnha mamãe é a Tamilis é muito muito linda e ainda tem um pauzão :3')
            break
        case 'papai':
            client.reply(from, 'Meu papai e o Luiz e ele gosta muiito da Tamilis')
            break
        case 'elogio':
            client.reply(from, 'Pauzao esse seu em')
            break
        case 'f':
            client.reply(from, 'F')
            break 
        case 'adeus':
        case 'flw':
            client.reply(from, 'Ate mais amiguinho')
            break
        case 'tendi':
            client.reply(from, 'Tendi tmb')
            break
        case 'bonoite':
            client.reply(from, 'Boa noiite :)')
            break
        case 'bodia':
        case 'bondia':
        case 'bundia':
            client.reply(from, 'Buundinhaa, ', pushname, 'dormiu bem ?')
            break
        case '#tts':
        case '#fala':
        case 'diga':
        case 'fale':
            if (args.length === 1) return client.reply(from, pushname, 'Comando incorreto '), client.reply(from,'comando correto : fale [idioma] [mensagem]'), client.reply(from, 'Insira os dados do idioma:'), client.reply(from, '[id] para indonésio, [en] para inglês, [jp] para japonês e [ar] para árabe, [pt] para português e [es] para espanhol')
            const ttsId = require('node-gtts')('id')
            const ttsEn = require('node-gtts')('en')
        const ttsJp = require('node-gtts')('ja')
            const ttsAr = require('node-gtts')('ar')
            const ttspt = require('node-gtts')('pt-br')
            const ttses = require('node-gtts')('es-es')
            const dataText = body.slice(8)
            if (dataText === '') return client.reply(from, 'Baka?', id)
            if (dataText.length > 500) return client.reply(from, 'Texto muito longo!', id)
            var dataBhs = body.slice(5, 7)
        if (dataBhs == 'id') {
                ttsId.save('./media/tts/resId.mp3', dataText, function () {
                client.sendPtt(from, './media/tts/resId.mp3', id)
                })
            } else if (dataBhs == 'en') {
                ttsEn.save('./media/tts/resEn.mp3', dataText, function () {
                    client.sendPtt(from, './media/tts/resEn.mp3', id)
                })
            } else if (dataBhs == 'jp') {
                ttsJp.save('./media/tts/resJp.mp3', dataText, function () {
                client.sendPtt(from, './media/tts/resJp.mp3', id)
                })
        } else if (dataBhs == 'ar') {
                ttsAr.save('./media/tts/resAr.mp3', dataText, function () {
                client.sendPtt(from, './media/tts/resAr.mp3', id)
                })
        } else if (dataBhs == 'pt'){
                ttspt.save('./media/tts/resPT.mp3', dataText, function (){
                client.sendPtt(from, './media/tts/resPT.mp3', id)
                })
            } else if (dataBhs == 'es'){
                ttses.save('./media/tts/resES.mp3', dataText, function (){
                client.sendPtt(from, './media/tts/resES.mp3', id)
                })
            } else {
                client.reply(from, 'Comando incorreto')
                client.reply(from, 'comando correto : fale [idioma] [mensagem]', id)
                client.reply('Insira os dados do idioma:'), client.reply(from, '[id] para indonésio, [en] para inglês, [jp] para japonês e [ar] para árabe, [pt] para português e [es] para espanhol')

            }
            break
        case '#botstat': {
            const loadedMsg = await client.getAmountOfLoadedMessages()
            const chatIds = await client.getAllChatIds()
            const groups = await client.getAllGroups()
            client.reply(from, `Status :\n- *${loadedMsg}* Loaded Messages\n- *${groups.length}* Group Chats\n- *${chatIds.length - groups.length}* Personal Chats\n- *${chatIds.length}* Total Chats`)
            break
        }
        default:
            console.log(color('[ERROR]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), 'Unregistered Command from', color(pushname))
            break
        }

    

    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
    }
}
