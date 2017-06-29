// dependencies
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { asyncConnect } from 'redux-connect'
import { Grid, Row } from 'react-styled-flexboxgrid'
// project files
import store from 'browser/redux/store'
import Loading from 'browser/components/Loading'
import MoodsFind from 'browser/components/MoodsFind'
import MoodsList from 'browser/components/MoodsList'
import MoodsInsert from 'browser/components/MoodsInsert'
import PageWrapper from 'browser/components/PageWrapper'
import YoutubeSearch from 'browser/components/YoutubeSearch'
import { parseJSON } from 'browser/redux/actions/actionHelpers'
import { fetchMoods, recieveMoods } from 'browser/redux/actions/MoodActions'

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
								moods={props.moods}
								totalPages={props.totalPages}
								currentPage={props.currentPage} />
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
				return store.dispatch(recieveMoods((response)))
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