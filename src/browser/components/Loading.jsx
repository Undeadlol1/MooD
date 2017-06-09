import React, { Component } from 'react'
import CircularProgress from 'material-ui/CircularProgress';

/**
 * show loading indicator
 * could be used as a wrapper via 'condition' prop
 */
export default ({condition = true, children, className}) => {
    if (!condition) return children
    else return <CircularProgress className={"Loading " + className} />
}
