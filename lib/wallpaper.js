const { fetchJson } = require('../util').fetcher

/**
 * Get wallpaper from random subreddit
 *
 * @param  {String} subreddit
 * @return  {Promise} Return wallpaper from Animewallpaper, AnimePhoneWallpapers, wallpapers
 */
module.exports = wallpaper = (subreddit) => new Promise((resolve, reject) => {
    const subreddits = ['Animewallpaper', 'AnimePhoneWallpapers', 'wallpapers']
    const randSub = subreddits[Math.random() * subreddits.length | 0]
    console.log('looking for wallpapers on ' + randSub)
    fetchJson('https://meme-api.herokuapp.com/gimme/' + randSub)
        .then((result) => resolve(result))
        .catch((err) => {
            console.error(err)
            reject(err)
        })
})
