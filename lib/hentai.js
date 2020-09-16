const { fetchJson } = require('../util').fetcher

/**
 * Get hentai from random subreddit
 *
 * @param  {String} subreddit
 * @return  {Promise} Return meme from hentai, ahegao, StealthVibes, RWBYNSFW, EmbarrassedHentai, HentaiAnal, animelegs, Touhou_NSFW, DarkSkinHentai, Pollewd, Lewdism, animeJOmaterial, MonsterGirl, yuri, BokuNoEroAcademia, Naruto_Hentai, waifusgonewild
 */
module.exports = hentai = (subreddit) => new Promise((resolve, reject) => {
    const subreddits = ['hentai', 'ahegao', 'StealthVibes', 'RWBYNSFW', 'EmbarrassedHentai', 'HentaiAnal', 'animelegs', 'Touhou_NSFW', 'DarkSkinHentai', 'Pollewd', 'Lewdism', 'animeJOmaterial', 'MonsterGirl', 'yuri', 'BokuNoEroAcademia', 'Naruto_Hentai', 'waifusgonewild']
    const randSub = subreddits[Math.random() * subreddits.length | 0]
    console.log('looking for hentais on ' + randSub)
    fetchJson('https://meme-api.herokuapp.com/gimme/' + randSub)
        .then((result) => resolve(result))
        .catch((err) => {
            console.error(err)
            reject(err)
        })
})
