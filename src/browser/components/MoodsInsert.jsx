import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid'
import { insertMood } from '../redux/actions/MoodActions'
import { TextField } from 'redux-form-material-ui'

@reduxForm({
	form: 'MoodsInsert',
	validate: values => {
		const errors = {}
		if (!values.name) errors.name = 'Name is required!'
		return errors
	}
})
@connect(
	(state, ownProps) => ({...ownProps}),
    (dispatch, ownProps) => ({
        insertMood({name}) {
            dispatch(insertMood(name))
			ownProps.reset()
        }
    })
)
export default class MoodsInsert extends Component {
	render() {
		const { insertMood, handleSubmit } = this.props
	    return  <form onSubmit={handleSubmit(insertMood)}>
					<Row>
						<Col sm={12}>
							<Field name="name" component={TextField} hintText="What's your mood?" fullWidth />
						</Col>
					</Row>
		        </form>

	}
}
