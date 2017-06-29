// dependencies
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { asyncConnect } from 'redux-connect'
import { Grid, Row } from 'react-styled-flexboxgrid'
// project files
import Loading from 'browser/components/Loading'
import MoodsFind from 'browser/components/MoodsFind'
import MoodsList from 'browser/components/MoodsList'
import MoodsInsert from 'browser/components/MoodsInsert'
import PageWrapper from 'browser/components/PageWrapper'
import YoutubeSearch from 'browser/components/YoutubeSearch'
import { fetchMoods } from 'browser/redux/actions/MoodActions'
import { parseJSON } from 'browser/redux/actions/actionHelpers'
import { fromJS } from 'immutable'

const {API_URL} = process.env
const moodsUrl = API_URL + 'moods/'

export class IndexPage extends Component {
    render() {
		const { props } = this
		const {prefetchedMoods, loading} = props
		return 	<PageWrapper
					loading={loading}
					className='IndexPage'
				>
					<Grid fluid>
						<MoodsInsert />
						{/* TODO what to do with this loading? */}
						<Loading condition={loading}>
							<MoodsList
								moods={prefetchedMoods.moods || props.moods}
								totalPages={prefetchedMoods.totalPages || props.totalPages}
								currentPage={prefetchedMoods.currentPage || props.currentPage} />
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
asyncConnect([
	{
		key: 'prefetchedMoods',
		promise: ({ params, helpers }) => {
			return fetch(moodsUrl)
			.then(parseJSON)
			.then(response => 	{
				response.moods = fromJS(response.moods)
				return response
			})
			.catch(error => {
				console.error(error)
				throw new Error(error)
			})
		}
	}
])
(connect(
	({ mood }) => ({
		moods: mood.get('moods'),
		loading: mood.get('loading'),
		totalPages: mood.get('totalPages'),
		currentPage: mood.get('currentPage'),
	}),
	dispatch => ({
		fetchMoods() {dispatch(fetchMoods())}
	})
)(IndexPage))