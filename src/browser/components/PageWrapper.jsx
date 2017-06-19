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
		const isServer = process.env.SERVER
		const isBrowser = process.env.BROWSER
		const {location, loading, children, preset} = this.props
        const cx = classNames('PageWrapper', this.props.className)
        // RouterTransition creates it's own 'div'
        // which makes it harder to apply styles on root class
        const rootStyles =  {
            minWidth: '100%',
            minHeight: '100%',
            // position: 'relative',
        }
        const childrenStyles = {
            opacity: '0',
            pointerEvents: 'none',
        }

        /*
            while server side rendered content is on page show loading screen and
            hide children beneath it so they can still be crawled for SEO
        */
        if (isServer) return  <div className={cx}>
                                    <div style={rootStyles}>
                                        <Loading condition={true} />
                                        <div style={childrenStyles} className="PageWrapper_children">{children}</div>
                                    </div>
                                </div>
        return  <Loading
                    className={this.props.className}
                    condition={isBrowser && loading}
                    style={rootStyles}
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