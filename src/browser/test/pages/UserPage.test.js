import React from 'react'
import sinon from 'sinon'
import chaiEnzyme from 'chai-enzyme'
import chai, { expect, assert } from 'chai'
import { shallow, mount, render } from 'enzyme'
import { UserPage } from 'browser/pages/UserPage'
import { translate } from 'browser/containers/Translator'
chai.should()
chai.use(chaiEnzyme())

function findAndConfirm(selector) {
  const element = wrapper.find(selector)
  assert(element.length == 1, `must have single <${selector}>`)
  return element
}

const props = {
                location: {},
                loading: false,
                isOwnPage: false,
                username: 'test',
                fetchUser: sinon.spy(),
                location: {pathname: 'some'},
              }
sinon.spy(UserPage.prototype, 'componentWillMount');
const wrapper = shallow(<UserPage {...props} />)

describe('<UserPage />', () => {
  it('calls componentWillMount', () => {
    assert(UserPage.prototype.componentWillMount.calledOnce)
    assert(props.fetchUser.calledOnce, 'called fetchUser()')
  })

  it('has className and tagName', () => {
    expect(wrapper).to.have.className('UserPage')
    expect(wrapper.type().name).to.eq('RouteTransition')
  })

  it('has proper dom structure', () => {
    findAndConfirm('RouteTransition')
    findAndConfirm('Styled(Grid)')
    findAndConfirm('Loading')
    findAndConfirm('div')
  })

  it('has <h2>', () => {
    const header = findAndConfirm('h2')
    expect(header.text()).to.eq(props.username)
  })


  it('has <Avatar />', () => {
    const {size, src} = findAndConfirm('Avatar').props()
    assert(size == 300, 'props.size')
    assert(src == `https://api.adorable.io/avatars/300/${props.username}.png`)
  })

  describe('has <ChangeLanguageForm>', () => {
    it('is not visible if not own page', () => {
      expect(wrapper.find('ReduxForm')).to.have.length(0)
    })
    it('is visible if own page', () => {
      props.isOwnPage = true
      const wrapper = shallow(<UserPage {...props} />)
      expect(wrapper.find('ReduxForm')).to.have.length(1)
    })
  })

});