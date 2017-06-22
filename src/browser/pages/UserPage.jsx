import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectProps } from 'relpers'
import { connect } from 'react-redux'
import Avatar from 'material-ui/Avatar'
import Loading from 'browser/components/Loading'
import MoodsList from 'browser/components/MoodsList'
import MoodsFind from 'browser/components/MoodsFind'
import MoodsInsert from 'browser/components/MoodsInsert'
import PageWrapper from 'browser/components/PageWrapper'
import { Grid, Row, Col } from 'react-styled-flexboxgrid'
import YoutubeSearch from 'browser/components/YoutubeSearch'
import { fetchUser } from 'browser/redux/actions/UserActions'
import ChangeLanguageForm from 'browser/components/ChangeLanguageForm'

export class UserPage extends Component {
	componentWillMount() { this.props.fetchUser(this.props.params.username) }
	@injectProps
    render({loading, location, UserId, username, isOwnPage}) {
		const src = `https://api.adorable.io/avatars/300/${UserId}.png`
		return 	<PageWrapper
					preset={'pop'}
					loading={loading}
					location={location}
					className='UserPage'
				>
					<Grid fluid>
						<Row center="xs">
							<Col xs={12}>
								<h2 className="UserPage__username">{username}</h2>
							</Col>
						</Row>
						<Row center="xs">
							<Col xs={12} className="UserPage__avatar">
								<Avatar size={300} src={src} />
							</Col>
						</Row>
						<Row>
							<Col xs={12}>
								{isOwnPage ? <ChangeLanguageForm /> : null}
							</Col>
						</Row>
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
		const UserId = user.getIn(['fetchedUser', 'id'])
		console.log('fetchedUser: ', user.get('fetchedUser').toJS());
		return {
			UserId,
			username: user.getIn(['fetchedUser', 'Local', 'username']),
			loading: user.get('loading'),
			fetchedUser: user.get('fetchedUser'),
			isOwnPage: user.get('id') == params.username, // TODO this,
		}
	},
	(dispatch, {params}) => ({
		fetchUser: () => dispatch(fetchUser(params.username)) // TOOD rework this
	})
)(UserPage)