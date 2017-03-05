import React, { PropTypes } from 'react'
// import { $ } from 'meteor/jquery'
// import { Provider } from 'react-redux';
// import { createStore, applyMiddleware } from 'redux';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import NavBar from './NavBar'
// import { rootReducer, initialState } from '../../redux/main'
// import createLogger from 'redux-logger'
// import thunk from 'redux-thunk'

import injectTapEventPlugin from 'react-tap-event-plugin'; // material-ui
injectTapEventPlugin(); // material-ui

// const logger = createLogger();
// const store = createStore(rootReducer, initialState, applyMiddleware(thunk)) // thunk, promise,

let timeout = null

export default class Layout extends React.Component {
	static propTypes = {
		main: PropTypes.node.isRequired,
		nav: PropTypes.node
	}

	state = { hidden: true }

	// componentDidMount() {
	// 	$('body').css('background-color', 'rgb(48, 48, 48)')
	// 	$('input[type=url]:focus:not([readonly])').css('box-shadow', 'none !important')
	// }

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
		// styles
		const 	baseStyles = 	{
									height: '100vh',
									minHeight: '100vh',
									backgroundColor: 'rgb(48, 48, 48)'
								},
				headerStyles = 	{
									position: 'fixed',
									zIndex: '1',
									width: '100%'
								}

		return	<MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
					<Provider store={store}>
						<div
							className='Layout'
							onMouseOver={this.showChildren}
							onMouseLeave={this.hideChildren}
							onMouseMove={this.showChildren}
							// onMouseStop={this.checker}
							onTouchEnd={this.hideWhenIdle}
							style={baseStyles}
						>
							<header className='MoodHeader' hidden={this.state.hidden} style={headerStyles}>
								{this.props.nav}
							</header>
							<main>
								{this.props.main}
							</main>
						</div>
					</Provider>
				</MuiThemeProvider>
	}
}
