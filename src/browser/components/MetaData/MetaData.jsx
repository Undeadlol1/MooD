import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'

export class MetaData extends Component {
	render() {
		const {props} = this
	    return  <Helmet>
					<title>{props.title}</title>
				</Helmet>

	}
}

MetaData.defaultProps = {
	title: process.env.APP_NAME
}

MetaData.PropTypes = {
	title: PropTypes.string
}

export default MetaData