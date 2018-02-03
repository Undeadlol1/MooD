import find from 'lodash/find'
import generateUuid from 'uuid/v4'
import filter from 'lodash/filter'
import matches from 'lodash/matches'
import extend from 'lodash/assignIn'
import includes from 'lodash/includes'
import { Node } from 'server/data/models'
import { parseUrl } from 'shared/parsers'
import chai, { assert, expect } from 'chai'
import {
    removeDuplicates
} from 'server/data/controllers/NodesController'
chai.should()

const UserId = 12345
const firstMoodId = generateUuid()
const secondMoodId = generateUuid()
const firstVideo = 'https://www.youtube.com/watch?v=1TB1x67Do5U'
const secondVideo = 'https://www.youtube.com/watch?v=6CvuyaKmLnw'
// two similar nodes in first mood and three similar in second one
const nodes = [
    extend(
        {
            UserId,
            MoodId: firstMoodId,
        },
        parseUrl(firstVideo)
    ),
    extend(
        {
            UserId,
            MoodId: firstMoodId,
        },
        parseUrl(firstVideo)
    ),
    extend(
        {
            UserId,
            MoodId: secondMoodId,
        },
        parseUrl(secondVideo)
    ),
    extend(
        {
            UserId,
            MoodId: secondMoodId,
        },
        parseUrl(secondVideo)
    ),
    extend(
        {
            UserId,
            MoodId: secondMoodId,
        },
        parseUrl(secondVideo)
    ),
]

// get nodes from two moods
const selector = {
    raw: true,
    where: {
        MoodId: {
            $or: [firstMoodId, secondMoodId]
        }
    }
}

export default describe('NodesController', function() {
    describe('removeDuplicates()', () => {
        // create nodes with duplicates before running tests
        before(async () => await Node.bulkCreate(nodes))
        // clean up
        after(async () => await Node.destroy(selector))

        it('does the job', async () => {
            assert.lengthOf( // make sure there are nodes
                await Node.findAll(selector), 5,
                'there must be 5 nodes before function runs'
            )
            await removeDuplicates() // run function
            const newNodes = await Node.findAll(selector)
            assert.lengthOf( // validate nodes.length
                await Node.findAll(selector), 2,
                'there must be 2 nodes after function run'
            )
        })
    })
})