const brainly = require('brainly-scraper')

module.exports = BrainlySearch = (perguntas, números, cb) => {
    brainly(pertanyaan.toString(),Number(montante)).then((res) => {
        let brainlyResult = []
        res.data.forEach((ask) => {
            let opt = {
                questão: ask.pertanyaan,
                perguntas de fotos: ask.questionMedia
            }
            ask.jawaban.forEach(answer => {
                opt.jawaban = {
                    resposta do título: answer.text,
                    foto resposta: answer.media
                }
            })
            brainlyResult.push(opt)
            })
            return brainlyResult
    }).then(x => {
        cb(x)
    }).catch(err => {
        console.log(err.error)
    })
}
