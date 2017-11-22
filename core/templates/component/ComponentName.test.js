import React from 'react'
import sinon from 'sinon'
import { shallow } from 'enzyme'
import chaiEnzyme from 'chai-enzyme'
import chai, { expect, assert } from 'chai'
import { translate as t } from 'browser/containers/Translator'
import { ComponentName } from 'browser/components/ComponentName'
chai.should()
chai.use(chaiEnzyme())

describe('<ComponentName />', () => {

  const props = {}
  const wrapper = shallow(<ComponentName {...props} />)

  it('has <Row>', () => {
    const el = wrapper.find('Styled(Row)')
    expect(el).to.have.length(1)
    expect(el).to.have.className('ComponentName')
  })

  it('has <Col>', () => {
    const el = wrapper.find('Styled(Col)')
    expect(el).to.have.length(1)
    expect(el.props().xs).to.eq(12)
  })

  it('failes the test', () => {
    assert(false)
  })

})