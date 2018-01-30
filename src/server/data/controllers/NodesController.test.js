import generateUuid from 'uuid/v4'
import filter from 'lodash/filter'
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
            MoodId: firstMoodId,
        },
        parseUrl(secondVideo)
    ),

]

export default describe('NodesController', function() {
    describe('removeDuplicates()', () => {
        // create nodes before running tests
        before(async () => {
            // create two duplicates in first mood and singe node in second mood
            await Node.bulkCreate(nodes)
        })
        // clean up
        after(async () => {
            await Node.destroy({where: {MoodId: firstMoodId}})
            await Node.destroy({where: {MoodId: secondMoodId}})
        })
        it('does the job', async () => {
            // get nodes from two moods
            const selector = {
                raw: true,
                where: {
                    MoodId: {
                        $or: [firstMoodId, secondMoodId]
                    }
                }
            }
            const nodes = await Node.findAll(selector)
            const duplicates = filter(nodes, function (value, index, iteratee) {
                return includes(iteratee, value, index + 1);
            });
            const newNodes = await Node.findAll(selector)
            expect(newNodes).to.have.length(2)
        })
    })
})