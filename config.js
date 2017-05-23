try {
    var node_env = process.env.NODE_ENV
    // use "development" config if nothing is specified,
    // also use "development" for tests
    if (!node_env || node_env == 'test') node_env = 'development'
    var config = require('./' + node_env + '.json')
}
catch (error) {
    console.error('Something went wrong during loading of configuration file!')
    throw new Error(error)
}

module.exports = config