import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectProps } from 'relpers'
import { connect } from 'react-redux'
import Avatar from 'material-ui/Avatar'
import Loading from '../components/Loading'
import MoodsList from '../components/MoodsList'
import MoodsFind from '../components/MoodsFind'
import MoodsInsert from '../components/MoodsInsert'
import YoutubeSearch from '../components/YoutubeSearch'
import { fetchUser } from '../redux/actions/UserActions'
import PageWrapper from 'browser/components/PageWrapper'
import { Grid, Row, Col } from 'react-styled-flexboxgrid'
import ChangeLanguageForm from '../components/ChangeLanguageForm'

export class UserPage extends Component {
	componentWillMount() { this.props.fetchUser() }
	@injectProps
    render({loading, location, username, isOwnPage}) {
				return 	<PageWrapper
							preset={'pop'}
							loading={loading}
							location={location}
							className='UserPage'
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
						</PageWrapper>
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
)(UserPage)