import PropTypes from 'prop-types'
import classNames from 'classnames'
import React, { Component } from 'react'
import Loading from 'browser/components/Loading'
// import { RouteTransition } from 'react-router-transition'
// import presets from 'react-router-transition/src/presets'

// TODO make this a decorator?
// TODO get location from react-router directly in order not to pass it eveyrime

/**
 * Wrapper for *Page.jsx components
 * Server-side it returns chidren with no modifications to be prerendered in html
 * Client-side it applies loading and page transition
 */
export default class PageWrapper extends Component {

    static defaultProps = {
        loading: false
    }

    static propTypes = {
        // TODO add defaultValue?
        loading: PropTypes.bool.isRequired,
        preset: PropTypes.string,
        location: PropTypes.object,
    }

    render() {
		const isBrowser = process.env.BROWSER
		const {location, loading, children, preset} = this.props
        const cx = classNames('PageWrapper', this.props.className)

        if (!isBrowser) return <div className={cx}>{children}</div>
        return  <Loading
                    className={cx}
                    condition={isBrowser && loading}
                >
                    {children}
                </Loading>
		// return  <RouteTransition
        //             className={cx}
        //             {...presets[preset]}
        //             /* TODO remove location required proptype (take it automatically) */
        //             pathname={location.pathname}
        //         >
                    // <Loading condition={isBrowser && loading}>
                        // {children}
                    // </Loading>
				// </RouteTransition>
    }
}