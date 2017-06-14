import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Loading from '../components/Loading'
import MoodsList from '../components/MoodsList'
import MoodsInsert from '../components/MoodsInsert'
import MoodsFind from '../components/MoodsFind'
import YoutubeSearch from '../components/YoutubeSearch'
import ChangeLanguageForm from '../components/ChangeLanguageForm'
import { injectProps } from 'relpers'
import { connect } from 'react-redux';
import { fetchUser } from '../redux/actions/UserActions'
import { RouteTransition } from 'react-router-transition';
import presets from 'react-router-transition/src/presets';
import { Grid, Row, Col } from 'react-styled-flexboxgrid'
import Avatar from 'material-ui/Avatar'
import { FormattedMessage } from 'react-intl';

export class UserPage extends Component {
	componentWillMount() { this.props.fetchUser() }
    @injectProps
    render({loading, location, username, isOwnPage}) {
		return  <RouteTransition
					{...presets.pop}
					className="UserPage"
					pathname={location.pathname}
				>
					<Grid>
						<Loading condition={loading}>
							<div>
								{isOwnPage ? <ChangeLanguageForm /> : null}
								<h2>{username}</h2>
								<Avatar size={300} src={`https://api.adorable.io/avatars/300/${username}.png`} />
							 </div>
						</Loading>
					</Grid>
				</RouteTransition>
    }
}

UserPage.propTypes = {
	username: PropTypes.string,
	loading: PropTypes.bool.isRequired,
	isOwnPage: PropTypes.bool.isRequired,
	fetchUser: PropTypes.func.isRequired,
	location: PropTypes.object.isRequired,
}

export default connect(
	({user}, {params}) => {
		const username = user.getIn(['fetchedUser', 'username'])
		return {
			username,
			loading: user.get('loading'),
			fetchedUser: user.get('fetchedUser'),
			isOwnPage: username.toLowerCase() == params.username.toLowerCase(),
		}
	},
	(dispatch, {params}) => ({
		fetchUser: () => dispatch(fetchUser(params.username)) // TOOD rework this
	})
)