import Boom from 'boom';

/**
 * TODO
 * 
 * @param {string} redirectRoute // TODO
 * @returns 
 */
export function mustLogin(req, res, next) { // redirectRoute = '/login'
    // if (user && user.id) return next()
    // console.log(user);
    // console.log(Boom.unauthorized());
    req.isAuthenticated() ? next() : res.boom.unauthorized('Please, log in to do this')
    // if (req.isAuthenticated()) next() 
    // else Boom.unauthorized()
    // else res.redirect('/login') // redirectRoute = '/login'
}