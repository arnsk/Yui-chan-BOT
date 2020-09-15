exports.textTnC = () => {
    return `
Este é um programa de código aberto (gratuito) escrito usando Javascript, você pode usar, copiar, modificar, combinar, publicar, distribuir, sublicenciar e ou vender cópias sem remover o autor principal do código-fonte / bot.

Usando source code / bot ini então você concorda com os seguintes termos e condições:
- Source code / bot não armazena seus dados em nossos servidores.
- Source code / bot não é responsável pelos adesivos que você faz a partir deste bot, bem como pelos vídeos, imagens e outros dados que você obtém de Source code / bot ini.
- Source code / bot não pode ser usado para serviços que visam / contribuem para: 
    • sexo / tráfico humano
    • jogos de azar
    • comportamento viciante prejudicial
    • crime
    • violência (a menos que necessário para proteger a segurança pública)
    • queima / desmatamento florestal
    • discurso de ódio ou discriminação com base na idade, sexo, identidade de gênero, raça, sexualidade, religião, nacionalidade

Código fonte BOT : https://github.com/YogaSakti/imageToSticker
Biblioteca NodeJS WhatsApp: https://github.com/open-wa/wa-automate-nodejs

Atenciosamente, Yoga Sakti.`
}

exports.textMenu = (pushname) => {
    return `
Oi, ${pushname}! 👋️
Aqui estão alguns dos recursos deste bot! ✨

Sticker Creator:
1. *#sticker*
Para transformar a imagem em um adesivo. (envie imagens com a legenda #sticker ou responda às imagens que foram enviadas com #sticker)

2. *#sticker* _<Url Gambar>_
Para mudar a imagem de url para adesivo.

3. *#gifsticker* _<Giphy URL>_ / *#stickergif* _<Giphy URL>_
Para transformar um GIF em um adesivo (somente Giphy)

Downloader:
1. *#tiktok* _<tiktok url> _
Para baixar vídeos do vídeo tiktok.

2. *#fb* _<post/video url>_
Para baixar videos do facebook.

3. *#ig* _<instagram post url>_
Para baixar videos so instagram.

4. *#twt* _<twitter post url>_
Para baixar videos do twitter.

Outras:
1. *#resi* _<kurir>_ _<nomer resi>_
Para verificar o status de entrega das mercadorias, lista de mensageiros: jne, pos, tiki, wahana, jnt, rpx, sap, sicepat, pcp, jet, dse, first, ninja, lion, idl, rex.

2. *#tnc*
Exibe os termos e condições do bot.

3. *#donasi*
exibir informações de doação.

Espero que você tenha um ótimo dia!✨`
}

exports.textAdmin = () => {
    return `
⚠ [ *Admin Group Only* ] ⚠ 
Aqui estão alguns dos recursos de administração de grupo incluídos neste bot!

1. *#kick* @user
Para remover membros do grupo (pode ser mais de 1).

2. *#promote* @user
Para promover membros a administradores do grupo.

3. *#demote* @user
Para rebaixar os administradores do Grupo.

4. *#tagall*
Para mencionar todos os membros do grupo. (Apenas Premium)

5. *#del*
Para deletar uma mensagem do bot (responda à mensagem do bot com #del)`
}

exports.textDonasi = () => {
    return `
Olá, obrigado por usar este bot, para apoiar este bot você pode ajudar doando através do seguinte link:
1. Saweria: https://saweria.co/yogasakti
2. Trakteer: https://trakteer.id/red-emperor 

A doação será usada para o desenvolvimento e operação deste bot.

Obrigado.`
}
