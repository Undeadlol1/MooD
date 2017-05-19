// TODO rework all of this
import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router'
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid'
import { insertMood } from '../redux/actions/MoodActions'
import { TextField, SelectField } from 'redux-form-material-ui'
import { checkStatus, parseJSON } from'../redux/actions/actionHelpers'
import slugify from 'slug'
import MenuItem from 'material-ui/MenuItem'
import Avatar from 'material-ui/Avatar'
import store from '../redux/store'
import { FormattedMessage } from 'react-intl';

@reduxForm({
	form: 'ChangeLanguageForm',
	validate(values) {
		let errors = {}
		const user = store.getState().user.get('id')

		if (!user) errors.name = 'Please login'
		if (!values.name) errors.name = "Name can't be empty"
		
		return errors
	},
	asyncBlurFields: [ 'name' ]
})
@connect(
	(state, ownProps) => ({...ownProps}),
    (dispatch, ownProps) => ({
        insertMood({name}) {
			// function insertSucces(slug) {
			// 	ownProps.reset()				
			// 	browserHistory.push('/mood/' + slug);
			// }
            // dispatch(insertMood(name, insertSucces))
        }
    })
)
export default class ChangeLanguageForm extends Component {
	render() {
		const { insertMood, handleSubmit, asyncValidating } = this.props
	    return  <form onSubmit={handleSubmit(insertMood)}>
					<Row>
						<Col xs={12}>
							<Field name="plan" component={SelectField} hintText={<FormattedMessage id="choose_your_language" />}>
								<MenuItem value="ru" primaryText="Русский"/>
								<MenuItem value="en" primaryText="English"/>
							</Field>
						</Col>
					</Row>
		        </form>

	}
}
