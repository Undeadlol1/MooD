import nock from 'nock'
import isArray from 'lodash/isArray'
import thunk from 'redux-thunk'
import chai, { expect } from 'chai'
import chaiImmutable from 'chai-immutable'
import configureMockStore from 'redux-mock-store'
import { createAction, createActions } from 'redux-actions'
import { initialState } from 'browser/redux/reducers/NodeReducer'
import { nextVideo, actions } from 'browser/redux/actions/NodeActions'
chai.should();
chai.use(chaiImmutable);

const middlewares = [ thunk ]
const { URL, API_URL } = process.env
const mockStore = configureMockStore(middlewares)
/**
 * test async action by intercepting http call
 * and cheking if expected redux actions have been called
 * @param {string} url request url
 * @param {function} action action to call
 * @param {any} param action param
 * @param {array} result expected actions
 * @param {string} [method='get'] request method
 * @returns
 */
// function mockRequest(url, action, param, result, method = 'get') {
//     // create request interceptor
//     nock(API_URL + 'uis')[method](url).reply(200, ui)
//     const store = mockStore()
//     return store
//       // call redux action
//       .dispatch(action(param))
//       // compare called actions with expected result
//       .then(() => expect(store.getActions()).to.deep.equal(result))
// }

describe('NodeAction', () => {

  // afterEach(() => nock.cleanAll())

  it('togglePageLoading calls toggleLoading', async () => {
    // const expectedActions = [actions.toggleLoading()]
    // const store = mockStore()
    // store.getActions()
    // // call redux action
    // store.dispatch(togglePageLoading())
    // const actualActions = store.getActions()
    // // compare called actions with expected result
    // expect(actualActions).to.deep.equal(expectedActions)
  })

})