// dependencies
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React, { PureComponent } from 'react'
import { Grid, Row } from 'react-styled-flexboxgrid'
// project files
import Loading from 'browser/components/Loading'
import PageWrapper from 'browser/components/PageWrapper'

class PageName extends PureComponent {
    render() {
		const { props } = this
		return 	<PageWrapper
					className='PageName'
					loading={props.loading}
				>
					<Grid fluid>
					</Grid>
				</PageWrapper>
    }
}

PageName.propTypes = {
	// prop: PropTypes.object,
}

export { PageName }

export default
connect(
	(state, ownProps) => ({
		// prop: mood.get('moods'),
		...ownProps
	}),
)(PageName)