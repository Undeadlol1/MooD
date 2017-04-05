import React, { Component, PropTypes } from 'react'
import { AppBar, Avatar } from 'material-ui'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import LoginLogoutButton from 'components/LoginLogoutButton'
import { toggleSidebar, toggleControls } from '../../redux/actions/GlobalActions'
// import classnames from 'classnames'

// import { gql, graphql } from 'react-apollo';
// @graphql(gql`query current_user { id }`)
@connect(
    ({ user, global  }, ownProps) => {
        const { controlsAreShown, headerIsShown } = global
        return { controlsAreShown, headerIsShown, user, ...ownProps }
    },
    (dispatch, ownProps) => ({
        toggleSidebar() {
            dispatch(toggleSidebar())
        }
    })
)
class NavBar extends Component {
    render() {
        const { user, headerIsShown, controlsAreShown, className, toggleSidebar, children, ...rest } = this.props
        const titleLink = <Link to="/" className="NavBar__home-link">MooD</Link>
        const loginButton = user.get('id')
                            ? <Avatar className="NavBar__avatar" src={user.get('image')} />
                            : <LoginLogoutButton />

        return  <header className={'NavBar ' + className}>
                    <AppBar
                        title={titleLink}
                        iconElementRight={loginButton}
                        onLeftIconButtonTouchTap={toggleSidebar}
                        {...rest} />
                        {children}
                </header>
    }
}

NavBar.propTypes = {
    // user: PropTypes.object.isRequired,
    // toggleSidebar: PropTypes.func.isRequired
}

export default NavBar