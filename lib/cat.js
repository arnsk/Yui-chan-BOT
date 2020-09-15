const { fetchJson } = require('../util').fetcher

/**
 * Get cat from random subreddit
 *
 * @param  {String} subreddit
 * @return  {Promise} Return cat from cats, cat, kittens
 */
module.exports = cat = (subreddit) => new Promise((resolve, reject) => {
    const subreddits = ['cat', 'cats', 'kittens']
    const randSub = subreddits[Math.random() * subreddits.length | 0]
    console.log('looking for cats on ' + randSub)
    fetchJson('https://meme-api.herokuapp.com/gimme/' + randSub)
        .then((result) => resolve(result))
        .catch((err) => {
            console.error(err)
            reject(err)
        })
})
