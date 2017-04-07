import React, { Component, PropTypes } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid'
import { insertMood } from '../redux/actions/MoodActions'
import { TextField } from 'redux-form-material-ui'
import { checkStatus, parseJSON } from'../redux/actions/actionHelpers'
import slugify from 'slug'

@reduxForm({
	form: 'MoodsInsert',
	asyncValidate(values) { // TODO find a way to not use this thing!
		return fetch('/api/moods/mood/' + slugify(values.name))
				.then(parseJSON)
				.then(result => {
					if (result) throw { name: 'This mood already exist!' } 
					else return
				})
    },
	validate(values) {
		const errors = {}
		if (!values.name) errors.name = 'Name is required!'
		return errors
	},
	asyncBlurFields: [ 'name' ]
})
@connect(
	(state, ownProps) => ({...ownProps}),
    (dispatch, ownProps) => ({
        insertMood({name}) {
			function insertSucces(slug) {
				ownProps.reset()				
				browserHistory.push('/mood/' + slug);
			}
            dispatch(insertMood(name, insertSucces))
        }
    })
)
export default class MoodsInsert extends Component {
	render() {
		const { insertMood, handleSubmit, asyncValidating } = this.props
	    return  <form onSubmit={handleSubmit(insertMood)}>
					<Row>
						<Col xs={12}>
							<Field name="name" component={TextField} hidden={asyncValidating} hintText="Add your own mood!" fullWidth />
						</Col>
					</Row>
		        </form>

	}
}