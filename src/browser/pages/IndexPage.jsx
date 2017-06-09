// dependencies
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Grid } from 'react-styled-flexboxgrid';
import { injectProps } from 'relpers'
import { connect } from 'react-redux'
import { RouteTransition } from 'react-router-transition'
import presets from 'react-router-transition/src/presets'
// project files
import { fetchMoods } from 'browser/redux/actions/MoodActions'
import Loading from 'browser/components/Loading'
import MoodsFind from 'browser/components/MoodsFind'
import MoodsList from 'browser/components/MoodsList'
import MoodsInsert from 'browser/components/MoodsInsert'
import YoutubeSearch from 'browser/components/YoutubeSearch'

export class IndexPage extends Component {

	componentWillMount() { this.props.fetchMoods() }

    @injectProps
    render({loading, moods, currentPage, totalPages, location}) {
		const isBrowser = process.env.BROWSER
		return  <RouteTransition				
						{...presets.pop}
						className="IndexPage"
						pathname={location.pathname}
					>
					<Grid>
						<MoodsInsert />
						<Loading condition={isBrowser && loading}>
							<MoodsList
								moods={moods}
								currentPage={currentPage}
								totalPages={totalPages} />
						</Loading>
					</Grid>
				</RouteTransition>
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
		totalPages: mood.get('totalPages'), // TODO rework this?
		currentPage: mood.get('currentPage'), // TODO rework this?
	}),
	dispatch => ({
		fetchMoods() {dispatch(fetchMoods())}
	})
)(IndexPage)