// dependencies
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React, { PureComponent } from 'react'
import { Grid, Row } from 'react-styled-flexboxgrid'
// project files
import MoodTabs from 'browser/components/MoodTabs'
import PageWrapper from 'browser/components/PageWrapper'
import WelcomeCard from 'browser/components/WelcomeCard'
import MoodsInsert from 'browser/components/MoodsInsert'

class IndexPage extends PureComponent {
    render() {
		const { props } = this
		return 	<PageWrapper className='IndexPage'>
					<WelcomeCard />
					<MoodsInsert />
					<MoodTabs />
				</PageWrapper>
    }
}

IndexPage.propTypes = {
	moods: PropTypes.object,
	totalPages: PropTypes.number,
	currentPage: PropTypes.number,
	location: PropTypes.object.isRequired,
}

export { IndexPage }

export default
connect(
	({mood}) => ({
		moods: mood.get('moods'),
		totalPages: mood.get('totalPages'),
		currentPage: mood.get('currentPage'),
	}),
)(IndexPage)