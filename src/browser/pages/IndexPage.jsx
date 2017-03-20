import React, { Component, PropTypes } from 'react'
import Loading from 'components/Loading'
import MoodsList from 'components/MoodsList'
import MoodsInsert from 'components/MoodsInsert'
import { injectProps } from 'relpers'
import { connect } from 'react-redux';
import { fetchMoods } from '../redux/actions/MoodActions'

@connect(
	({ global, mood, node }) => {
		// const { global, mood, node } = state
		const 	{ moods, loading } = mood
		// const 	{ loading } = global
		const 	nodes = node && node.nodes || []
		return 	{ moods, nodes, loading }
	},
	dispatch => ({
		fetchMoods() {dispatch(fetchMoods())}
	})
)
export default class IndexPage extends Component {

	static propTypes = {
		moods: PropTypes.array,
		nodes: PropTypes.array,
		loading: PropTypes.bool
	}

	componentWillMount() { this.props.fetchMoods() }

    @injectProps
    render({loading, moods, nodes, dispatch}) {
		/*return 	<div>
					<MoodsInsert />
					<MoodsList moods={moods} nodes={nodes} />
				</div>*/
        return 	loading
                ?   <Loading />
                :	<div>
	        				<MoodsInsert />
	        		    	<MoodsList moods={moods} nodes={nodes} />
	        	    	</div>
    }
}
