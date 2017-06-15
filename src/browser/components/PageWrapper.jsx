import PropTypes from 'prop-types'
import classNames from 'classnames'
import React, { Component } from 'react'
import Loading from 'browser/components/Loading'
import { RouteTransition } from 'react-router-transition'
import presets from 'react-router-transition/src/presets'

// TODO make this a decorator?
// TODO get location from react-router directly in order not to pass it eveyrime

/**
 * Wrapper for *Page.jsx components
 * Server-side it returns chidren with no modifications to be prerendered in html
 * Client-side it applies loading and page transition
 */
export default class PageWrapper extends Component {

    static propTypes = {
        loading: PropTypes.bool.isRequired,
        preset: PropTypes.string.isRequired,
        location: PropTypes.object.isRequired,
    }

    render() {
		const isBrowser = process.env.BROWSER
		const {location, loading, children, preset} = this.props
        const cx = classNames('PageWrapper', this.props.className)

        console.log('isBrowser: ', isBrowser);
        if (!isBrowser) return <div className={cx}>{children}</div>
		return  <RouteTransition
                    className={cx}
                    {...presets[preset]}
                    /* TODO remove location required proptype (take it automatically) */
                    pathname={location.pathname}
                >
                    <Loading condition={isBrowser && loading}>
                        {children}
                    </Loading>
				</RouteTransition>
    }
}