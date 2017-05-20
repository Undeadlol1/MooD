try {
    var config = require('./' + process.env.NODE_ENV + '.json')
    console.log('config', config)
}
catch (error) {
    console.error('Something went wrong during loading of configuration file!')
    throw new Error(error)
}

module.exports = config