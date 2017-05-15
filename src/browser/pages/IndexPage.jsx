import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Loading from '../components/Loading'
import MoodsList from '../components/MoodsList'
import MoodsInsert from '../components/MoodsInsert'
import MoodsFind from '../components/MoodsFind'
import YoutubeSearch from '../components/YoutubeSearch'
import { Grid } from 'react-flexbox-grid';
import { injectProps } from 'relpers'
import { connect } from 'react-redux';
import { fetchMoods } from '../redux/actions/MoodActions'
import { RouteTransition } from 'react-router-transition';
import presets from 'react-router-transition/src/presets';

@connect(
	({ global, mood }) => ({
		moods: mood.get('moods'),
		loading: mood.get('loading'),
		totalPages: mood.get('totalPages'), // TODO rework this?
		currentPage: mood.get('currentPage'), // TODO rework this?
	}),
	dispatch => ({
		fetchMoods() {dispatch(fetchMoods())}
	})
)
export default class IndexPage extends Component {

	static propTypes = {
		moods: PropTypes.object,
		loading: PropTypes.bool
	}

	componentWillMount() { this.props.fetchMoods() }

    @injectProps
    render({loading, moods, currentPage, totalPages, dispatch, location}) {
        // return 	loading
                // ?   <Loading />
                // :	<RouteTransition
		return  <RouteTransition				
						pathname={location.pathname}
						{...presets.pop}
					>
					<Grid className="IndexPage">
						{/*<YoutubeSearch />*/}
						{/*<MoodsFind />*/}
						<MoodsInsert />						
						{
							process.env.BROWSER && loading
							? <Loading />
							: <div>
								<MoodsList moods={moods} currentPage={currentPage} totalPages={totalPages} />
							 </div> 
						}
					</Grid>						
				</RouteTransition>
    }
}
