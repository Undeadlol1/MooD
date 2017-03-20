import { Grid } from 'react-flexbox-grid';
import React, { PropTypes } from 'react'
import { connect } from 'react-redux';
import { Link } from 'react-router';
import NavBar from './NavBar'
import { fetchCurrentUser, logoutCurrentUser } from '../../redux/actions/UserActions'

let timeout = null

@connect(
	(state, ownProps) => ({ user: state.user, ...ownProps}),
	(dispatch, ownProps) => ({
		fetchCurrentUser() { // fetch user data on load
			dispatch(fetchCurrentUser())
		},
		logout(event) {
			event.preventDefault()
			dispatch(logoutCurrentUser())
		}
    })
)
export default class Layout extends React.Component {
	static propTypes = {
		// main: PropTypes.node.isRequired,
		// nav: PropTypes.node
	}

	state = {
		hidden: false,
		// hidden: true,
	}

	// componentDidMount() {
	// 	$('body').css('background-color', 'rgb(48, 48, 48)')
	// 	$('input[type=url]:focus:not([readonly])').css('box-shadow', 'none !important')
	// }
	
	componentDidMount() {
		this.props.fetchCurrentUser()
	}

	showChildren = () => {
		clearInterval(timeout)
		// $('.Decision').show()
		this.setState({ hidden: false })
		timeout = setTimeout(() => {
			this.hideChildren()
		}, 2500);
	}

	hideChildren = () => {
		// $('.Decision').hide()
		this.setState({ hidden: true })
	}

	render() {
		const { logout } = this.props
		
		// styles
		const 	baseStyles = 	{
									height: '100vh',
									minHeight: '100vh',
									backgroundColor: 'rgb(48, 48, 48)',
									color: 'white'
								},
				headerStyles = 	{
									// position: 'fixed',
									zIndex: '1',
									width: '100%'
								}

		return <div
					className='Layout'
					style={baseStyles}
					//onMouseOver={this.showChildren}
					//onMouseLeave={this.hideChildren}
					//onMouseMove={this.showChildren}
					//onTouchEnd={this.hideWhenIdle}
					// onMouseStop={this.checker} // this useed to be here already commented out
				>
					<header className='MoodHeader' hidden={this.state.hidden} style={headerStyles}>
						{/*{this.props.nav}*/}
						<NavBar />
					</header>
					<main>
						<Grid>
							{this.props.children}
							{/*{this.props.main}*/}
							<h1>Привет, Сабинка!</h1>
							<h2>Ты самая лучшая! 😍</h2>
							<ul>
								<li><Link to="/login">Залогиньсо</Link></li>
								<li><a onClick={logout} href="">Logout</a></li>
							</ul>
						</Grid>
					</main>
				</div>
	}
}
