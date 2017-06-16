import React, { Component } from 'react'
import CircularProgress from 'material-ui/CircularProgress';
import classNames from 'classnames'
import isEmpty from 'lodash/isEmpty'

/**
 * show loading indicator
 * could be used as a wrapper via 'condition' prop
 */
export default function Loading ({condition, children, className}) {
    if (condition == false && !isEmpty(children)) return <div>{children}</div>
    return <CircularProgress className={classNames("Loading", className)} />
}
