const { fetchJson } = require('../util').fetcher

/**
 * Get futa from random subreddit
 *
 * @param  {String} subreddit
 * @return  {Promise} Return futa from FutanariHentai, Futa_Hentai, traphentai, DeliciousTraps
 */
module.exports = futa = (subreddit) => new Promise((resolve, reject) => {
    const subreddits = ['FutanariHentai', 'traphentai', 'DeliciousTraps']
    const randSub = subreddits[Math.random() * subreddits.length | 0]
    console.log('looking for futa on ' + randSub)
    fetchJson('https://meme-api.herokuapp.com/gimme/' + randSub)
        .then((result) => resolve(result))
        .catch((err) => {
            console.error(err)
            reject(err)
        })
})
