const { fetchJson } = require('../util').fetcher

/**
 * Get meme from random subreddit
 *
 * @param  {String} subreddit
 * @return  {Promise} Return meme from ShitpostBR, shitpostbrasil
 */
module.exports = meme = (subreddit) => new Promise((resolve, reject) => {
    const subreddits = ['ShitpostBR', 'shitpostbrasil', 'nhaa', '24fun']
    const randSub = subreddits[Math.random() * subreddits.length | 0]
    console.log('looking for memes on ' + randSub)
    fetchJson('https://meme-api.herokuapp.com/gimme/' + randSub)
        .then((result) => resolve(result))
        .catch((err) => {
            console.error(err)
            reject(err)
        })
})
