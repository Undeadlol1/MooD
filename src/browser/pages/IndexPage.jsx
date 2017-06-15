// dependencies
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Grid } from 'react-styled-flexboxgrid'
// project files
import Loading from 'browser/components/Loading'
import MoodsFind from 'browser/components/MoodsFind'
import MoodsList from 'browser/components/MoodsList'
import MoodsInsert from 'browser/components/MoodsInsert'
import YoutubeSearch from 'browser/components/YoutubeSearch'
import PageWrapper from 'browser/components/PageWrapper'
import { fetchMoods } from 'browser/redux/actions/MoodActions'

export class IndexPage extends Component {

	componentWillMount() { this.props.fetchMoods() }

    render() {
		const {loading, moods, currentPage, totalPages, location} = this.props
		return 	<PageWrapper
					preset={'pop'}
					loading={loading}
					location={location}
					className='IndexPage'
				>
					<Grid>
						<MoodsInsert />
						{/* TODO what to do with this loading? */}
						<Loading condition={loading}>
							<MoodsList
								moods={moods}
								totalPages={totalPages}
								currentPage={currentPage} />
						</Loading>
					</Grid>
				</PageWrapper>
    }
}

IndexPage.propTypes = {
	moods: PropTypes.object,
	totalPages: PropTypes.number,
	currentPage: PropTypes.number,
	loading: PropTypes.bool.isRequired,
	location: PropTypes.object.isRequired,
	fetchMoods: PropTypes.func.isRequired,
}

export default
connect(
	({ mood }) => ({
		moods: mood.get('moods'),
		loading: mood.get('loading'),
		totalPages: mood.get('totalPages'),
		currentPage: mood.get('currentPage'),
	}),
	dispatch => ({
		fetchMoods() {dispatch(fetchMoods())}
	})
)(IndexPage)