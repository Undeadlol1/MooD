require('babel-polyfill')
const slugify = require('slug')
const uniqid = require('uniqid')
const extend = require('lodash/assignIn')
const users = require('../data/fixtures/users.js')
const { parseUrl } = require('../../shared/parsers.js')
const { User, Mood, Node, Decision } = require('../data/models/index.js')

urls = [
            "https://www.youtube.com/watch?v=nBwHtgQH2EQ",
            "https://www.youtube.com/watch?v=l5-gja10qkw",
            "https://www.youtube.com/watch?v=M3B5U1S-I4Y",
            "https://www.youtube.com/watch?v=P027oGJy2n4",
            "https://www.youtube.com/watch?v=VoA9tLkrgHY",
            "https://www.youtube.com/watch?v=7CPH5L7ip3A",
            "https://www.youtube.com/watch?v=Jwglgn1mo3M",
            "https://www.youtube.com/watch?v=3Pv7jAKIPa0",
            "https://www.youtube.com/watch?v=KrCMWS_fB4o",
            "https://www.youtube.com/watch?v=W7mNmiW9qts",
            "https://www.youtube.com/watch?v=Q29SbuuvGEM",
        ]

// this function creates random digit and
// adds Date.now after decimal point
// afterwards last digit after decimal is randomized,
// since on .bulkCreate every Date.now() is the same
// (this is needed to make every rating unique to
// avoid duplicates and infinite cycles in node fetching api)
function randomIntFromInterval(min, max) {
    const randomNumber = Math.floor(Math.random()*(max-min+1)+min)
    let now = ('0.' + Date.now().toString()).split('')
    const dateLastDigit = now.pop()
    now.push(Number(dateLastDigit) + Math.abs(Number(randomNumber))) // sometimes adds two digits instead of one
    now = Number(now.join(''))
    const randomWithDate = Number(randomNumber.toFixed(1)) + now
    return randomWithDate
}

// insert fixtures into database
before(function() {
    const moods = [],
          nodes = [],
          decisions = []
    // create users
    User.bulkCreate(users)
        // refetch users because .bulkCreate return objects with id == null
        .then(() => User.findAll())
        // create moods fixtures array
        .each(user => {
            const name = uniqid()
            moods.push({
                name,
                slug: slugify(name),
                UserId: user.get('id'),
            })
        })
        // create moods
        .then(() => Mood.bulkCreate(moods))
        .then(() => Mood.findAll())
        .each(mood => {
            urls.forEach(url => {
                const rating = randomIntFromInterval(-3, 20) 
                nodes.push(
                    extend(
                        parseUrl(url), {
                        rating,
                        MoodId: mood.id,
                        UserId: mood.UserId,
                    })
                )
            })
        })
        // create nodes
        .then(() => Node.bulkCreate(nodes))
        .then(() => Node.findAll())
        .each(node => {
            decisions.push({
                NodeId: node.id,
                MoodId: node.MoodId,
                UserId: node.UserId,
                NodeRating: node.rating,
                rating: Number(randomIntFromInterval(-3, 20)),
            })
        })
        // create decisions
        .then(() => Decision.bulkCreate(decisions))
})

// clean up db
after(function() {
    User.destroy({ where: {} })
    Mood.destroy({ where: {} })
    Node.destroy({ where: {} })
    Decision.destroy({ where: {} })
})

/* This will search for files ending in .test.js and
   require them into webpack bundle */
var context = require.context('.', true, /.+\.test\.js?$/);
context.keys().forEach(context);
module.exports = context;