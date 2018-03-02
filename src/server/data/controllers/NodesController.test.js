import faker from 'faker'
import find from 'lodash/find'
import fill from 'lodash/fill'
import map from 'lodash/map'
import generateUuid from 'uuid/v4'
import filter from 'lodash/filter'
import matches from 'lodash/matches'
import extend from 'lodash/assignIn'
import includes from 'lodash/includes'
import { Node, Decision } from 'server/data/models'
import { parseUrl } from 'shared/parsers'
import chai, { assert, expect } from 'chai'
import {
    resetRatings,
    removeDuplicates,
} from 'server/data/controllers/NodesController'
chai.should()
chai.use(require('chai-properties'))

// variables
const   UserId = 12345,
        firstMoodId = generateUuid(),
        secondMoodId = generateUuid(),
        firstVideo = 'https://www.youtube.com/watch?v=1TB1x67Do5U',
        secondVideo = 'https://www.youtube.com/watch?v=6CvuyaKmLnw'
// create bunch of duplicates with different scenarious
const nodes = [
    // two similar nodes in first mood and three similar in second one
    // UserId is the same
    ...map(Array(2), () => ({
        UserId,
        MoodId: firstMoodId,
        ...parseUrl(firstVideo)
    })),
    ...map(Array(3), () => ({
        UserId,
        MoodId: secondMoodId,
        ...parseUrl(secondVideo)
    })),
    // 10 nodes in first mood with same contentId and random UserId
    ...map(Array(10), () => ({
        type: 'video',
        url: firstVideo,
        provider: 'youtube',
        contentId: '1TB1x67Do5U',
        MoodId: firstMoodId,
        UserId: faker.random.uuid(),
    })),
    // 10 nodes in second mood with same contentId and random UserId
    ...map(Array(10), () => ({
        type: 'video',
        url: secondVideo,
        provider: 'youtube',
        contentId: '6CvuyaKmLnw',
        MoodId: secondMoodId,
        UserId: faker.random.uuid(),
    }))
]
// select nodes from two moods
const selector = {
    raw: true,
    where: {
        MoodId: {
            $or: [firstMoodId, secondMoodId]
        }
    }
}

export default describe('NodesController', function() {
    /**
     * This function must find nodes with same
     * 'MoodId', 'contentId', 'provider' and 'type' fields.
     * It will delete all of the except one.
     */
    describe('removeDuplicates()', () => {
        // create nodes with duplicates before running tests
        before(async () => await Node.bulkCreate(nodes))
        // clean up
        after(async () => await Node.destroy(selector))
        /**
         * This test verifies existence of 25 duplicates before it runs.
         * Afterwards it verifies that only 2 non duplicate nodes left.
         * All other must be destoryed.
         */
        it('does the job', async () => {
            assert.lengthOf( // make sure there are nodes
                await Node.findAll(selector), 25,
                'there must be 25 nodes before function runs'
            )
            await removeDuplicates() // run function
            const newNodes = await Node.findAll(selector)
            assert.lengthOf( // validate nodes.length
                await Node.findAll(selector), 2,
                'there must be 2 nodes after function run'
            )
        })
    })

    // it('resetRatings()', async () => {
    //     // run function
    //     await resetRatings()
    //     // test
    //     await Node
    //         .findAll()
    //         .each(node => {
    //             expect(node.rating).to.be.below(1)
    //             expect(node.rating).to.have.length.above(10)
    //         })
    //     await Decision
    //         .findAll()
    //         .each(decision => {
    //             expect(decision.vote).to.be.null
    //             expect(decision.NodeRating).to.be.below(1)
    //             expect(decision.NodeRating).to.have.length.above(10)
    //         })
    // })
})