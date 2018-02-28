// dependencies
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React, { Component } from 'react'
// project files
import MoodTabs from 'browser/components/MoodTabs'
import PageWrapper from 'browser/components/PageWrapper'
import WelcomeCard from 'browser/components/WelcomeCard'
import MoodsInsert from 'browser/components/MoodsInsert'

class IndexPage extends Component {
    render() {
		const { props } = this
		return 	<PageWrapper className='IndexPage'>
					<h1>THIS IS A TEST</h1>
					<WelcomeCard />
					<MoodsInsert />
					<MoodTabs />
				</PageWrapper>
    }
}

IndexPage.propTypes = {}

export { IndexPage }

export default
connect(
	(state, ownProps) => ({...ownProps})
)(IndexPage)