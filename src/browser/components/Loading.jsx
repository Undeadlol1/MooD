import React, { Component } from 'react'
import CircularProgress from 'material-ui/CircularProgress';
import classNames from 'classnames'
import { isEmpty } from 'lodash'

/**
 * show loading indicator
 * could be used as a wrapper via 'condition' prop
 */
export default function Loading ({condition, children, className}) {
    if (condition == false && !isEmpty(children)) return children
    return <CircularProgress className={classNames("Loading", className)} />
}
