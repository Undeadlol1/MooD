import nock from 'nock'
import { spy } from 'sinon'
import thunk from 'redux-thunk'
import extendObject from 'lodash/assignIn'
import chaiImmutable from 'chai-immutable'
import chai, { expect, assert } from 'chai'
import configureMockStore from 'redux-mock-store'
import { initialState } from 'browser/redux/reducers/NodeReducer'
import {
  vote,
  actions,
  nextVideo,
  createDecision,
  deleteDecision,
  updateDecision,
} from 'browser/redux/actions/NodeActions'
import { fromJS } from 'immutable';
chai.should()
chai.use(chaiImmutable)

/**
 * Create mocked store with state
 * @param {Object} [state={}] value of getState().node
 */
function mockStore(state={}) {
  return configureMockStore([thunk])({node: fromJS(state)})
}
const { URL, API_URL } = process.env
// TODO: add proper node fixtures
const node = {name: 'misha', id: 1}
const decision = {
  id: 1,
  vote: true,
  NodeId: 'someId'
}
const nodes = [
  {id: 1},
  {id: 2},
  {id: 3},
]

describe('NodeActions', () => {

  afterEach(() => nock.cleanAll())
  /**
   * FIXME: add comment before commiting.
   */
  describe('nextVideo()', () => {
    /**
     * Each time function is called, next video in array must be selected.
     * Example - if there are only 3 videos in array they must appear like so:
     * 1 2 3 1 2 3 1 and so on.
     */
    it('cycles through videos properly', () => {
      // TODO:
      // const expectedEactions =
      const store = mockStore({
        nodes,
      })
      store.dispatch(nextVideo())
      const updatedState = store.getState().node.toJS()
      // Make sure length has not changed.
      expect(updatedState.nodes).to.have.length(3)
    })

    it('chooses first one if there are no more', () => {
      // TODO
      const store = mockStore({ nodes })

    })

    it('fetches videos if needed', () => { // FIXME: is this correct name for test

    })
  })

  it('createDecision calls updateNode and callback', async () => {
    const callback = spy()
    const store = mockStore()
    const expectedActions = [actions.updateNode({ Decision: decision })]
    // intercept request
    nock(API_URL).post('/decisions/', decision).reply(200, decision)
    return store
      // call redux action
      .dispatch(createDecision(decision, callback))
      // compare called actions with expected result
      .then(() => {
        expect(store.getActions()).to.deep.equal(expectedActions)
        // make sure callback is called
        assert(callback.calledOnce, 'callback not called')
        assert(callback.calledWith(decision), 'callback not called with proper params')
      })
  })

  it('createDecision calls updateNode and callback', async () => {
    const callback = spy()
    const store = mockStore()
    const expectedActions = [actions.updateNode({Decision: decision})]
    // intercept request
    nock(API_URL).post('/decisions/', decision).reply(200, decision)
    return store
      // call redux action
      .dispatch(createDecision(decision, callback))
      // compare called actions with expected result
      .then(() => {
        expect(store.getActions()).to.deep.equal(expectedActions)
        // make sure callback is called
        assert(callback.calledOnce, 'callback not called')
        assert(callback.calledWith(decision), 'callback not called with proper params')
      })
  })

  it('deleteDecision calls updateNode and callback', async () => {
    const callback = spy()
    const store = mockStore()
    const expectedActions = [actions.updateNode({Decision: {}})]
    // intercept request
    nock(API_URL).delete('/decisions/' + decision.id).reply(200)
    return store
      // call redux action
      .dispatch(deleteDecision(decision.id, callback))
      // compare called actions with expected result
      .then(() => {
        expect(store.getActions()).to.deep.equal(expectedActions)
        // make sure callback is called
        assert(callback.calledOnce, 'callback not called')
      })
  })

  describe('updateDecision', () => {
    it('calls updateNode and callback', async () => {
      const callback = spy()
      const store = mockStore()
      const payload = {vote: null}
      const updatedDecision = extendObject(decision, payload)
      const expectedActions = [actions.updateNode({Decision: updatedDecision})]
      // intercept request
      nock(API_URL).put('/decisions/' + decision.id).reply(200, updatedDecision)
      return store
        // call redux action
        .dispatch(updateDecision(updatedDecision.id, payload, callback))
        // compare called actions with expected result
        .then(() => {
          expect(store.getActions()).to.deep.equal(expectedActions)
          // make sure callback is called
          assert(callback.calledOnce, 'callback not called')
          assert(callback.calledWith(updatedDecision), 'callback not called with proper params')
        })
    })

    // it('also calls removeNode and nextVideo if neccesery', async () => {
    //   const callback = spy()
    //   const store = mockStore()
    //   const payload = {vote: false}
    //   const updatedDecision = extendObject(decision, payload)
    //   const expectedActions = [
    //     nextVideo(),
    //     actions.removeNode(decision.NodeId),
    //     actions.updateNode({Decision: updatedDecision}),
    //   ]
    //   // intercept request
    //   nock(API_URL).put('/decisions/' + decision.id).reply(200, updatedDecision)
    //   return store
    //     // call redux action
    //     .dispatch(updateDecision(updatedDecision.id, payload, callback))
    //     // compare called actions with expected result
    //     .then(() => {
    //       expect(store.getActions()).to.deep.equal(expectedActions)
    //       // make sure callback is called
    //       assert(callback.calledOnce, 'callback not called')
    //       assert(callback.calledWith(updatedDecision), 'callback not called with proper params')
    //     })
    // })

  })

})