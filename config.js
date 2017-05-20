try {
    var node_env = process.env.NODE_ENV
    // there is no need for special config for testing,
    // just use 'development' instead
    if (node_env == 'test') node_env = 'development'
    var config = require('./' + node_env + '.json')
}
catch (error) {
    console.error('Something went wrong during loading of configuration file!')
    throw new Error(error)
}

module.exports = config