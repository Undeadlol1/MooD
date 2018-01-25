import cls from 'classnames'
import cookies from 'cookies-js'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'
import React, { Component } from 'react'
import { withCookies } from 'react-cookie'
import FlatButton from 'material-ui/FlatButton'
import { Row, Col } from 'react-styled-flexboxgrid'
import { translate as t } from 'browser/containers/Translator'
import { Card, CardText, CardActions } from 'material-ui/Card'

class WelcomeCard extends Component {

	state = { isHidden: false }

	handleClick = () => {
		cookies.set('hideWelcomeCard', true)
		this.setState({ isHidden: true })
	}

	render() {
		const {state, props} = this
		const className = cls(props.className, "WelcomeCard")
		if (state.isHidden || props.cookies.get('hideWelcomeCard')) return null
		return 	<Row className={className}>
					<Col xs={12}>
						<Paper zDepth={5}>
							<Card>
								<CardText>
									<p>{t('mood_is_a_content_consumption_service')}</p>
									<p>{t('pick_your_mood_and_service_will_generate')}</p>
								</CardText>
								<CardActions>
									<FlatButton
										fullWidth
										label={t('ok')}
										primary={true}
										onClick={this.handleClick}
									/>
								</CardActions>
							</Card>
						</Paper>
					</Col>
				</Row>
	}
}

WelcomeCard.defaultProps = {}

WelcomeCard.PropTypes = {}

export { WelcomeCard }
export default withCookies(WelcomeCard)