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

function randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
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
                nodes.push(
                    extend(
                        parseUrl(url), {
                        MoodId: mood.id,
                        UserId: mood.UserId,
                        rating: randomIntFromInterval(-3, 20),
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
                rating: randomIntFromInterval(-3, 20),
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