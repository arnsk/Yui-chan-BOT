const { fetchJson } = require('../util').fetcher

/**
 * Get waifu from random subreddit
 *
 * @param  {String} subreddit
 * @return  {Promise} Return waifu from awwanime, pantsu, cutelittlefangs
 */
module.exports = waifu = (subreddit) => new Promise((resolve, reject) => {
    const subreddits = ['awwanime', 'pantsu', 'cutelittlefangs']
    const randSub = subreddits[Math.random() * subreddits.length | 0]
    console.log('looking for waifus on ' + randSub)
    fetchJson('https://meme-api.herokuapp.com/gimme/' + randSub)
        .then((result) => resolve(result))
        .catch((err) => {
            console.error(err)
            reject(err)
        })
})
