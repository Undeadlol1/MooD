import React from 'react'
import { shallow } from 'enzyme'
import chaiEnzyme from 'chai-enzyme'
import chai, { expect, assert } from 'chai'
import MetaData from 'browser/components/MetaData'
chai.should()
chai.use(chaiEnzyme())

describe('<MetaData />', () => {
  const props = {}
  const wrapper = shallow(<MetaData {...props} />);

  it('has <Helmet />', () => {
    const helmet = wrapper.find('HelmetWrapper')
    expect(helmet).to.have.length(1);
  })

  it('has <title>', () => {
    const title = wrapper.find('title')
    expect(title).to.have.length(1)
    expect(title.text()).to.eq(process.env.APP_NAME)
  })

  it('has proper defaultProps', () => {
    const actual = MetaData.defaultProps
    const expected = {
      appUrl: process.env.URL,
      title: process.env.APP_NAME,
    }
    expect(actual).to.deep.eq(expected)
  })

})