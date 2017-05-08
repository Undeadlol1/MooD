const faker = require('faker')
const uniqid = require('uniqid')
const { User } = require('../models/index.js')

const users = []

for(x=0; x<10; x++) {
    users.push({
        username: uniqid(),
        image   : faker.image.imageUrl(),
        password: faker.internet.email(),
    })
}

module.exports = users