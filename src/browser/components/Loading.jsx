import React, { Component } from 'react'
import CircularProgress from 'material-ui/CircularProgress';
import classNames from 'classnames'
import isEmpty from 'lodash/isEmpty'

/**
 * show loading indicator
 * could be used as a wrapper via 'condition' prop
 */
export default function Loading ({condition, children, style, className}) {
    const styles = style || {
        top: '50%',
        left: '50%',
        position: 'absolute', //!important;
        transform: 'translate(-50%, -50%)',
    }
    const cx = classNames('Loading', className)
    if (!condition && !isEmpty(children)) return <div className={className}>{children}</div>
    return <div style={styles} className={className} ><CircularProgress className="loading" style={styles} /></div>
}
