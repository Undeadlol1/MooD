import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { parseUrl } from '../helpers.js'
import { If } from './Utils.jsx'
import { insertNode, actions } from '../redux/actions/NodeActions'
import { toggleControls } from '../redux/actions/GlobalActions'
import { assignIn as extend } from 'lodash'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
// import RaisedButton from 'material-ui/RaisedButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import {white} from 'material-ui/styles/colors';
import ContentAdd from 'material-ui/svg-icons/content/add'
import { Form, Field, reduxForm } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import { history } from 'react-router';
import store from '../redux/store'

function isUrl(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return pattern.test(str);
}

@reduxForm({
	form: 'NodesInsert',
    // asyncValidate(values) {
    //     fetch('api')
    // },
	validate({url}, second) {
		let errors = {}
        const user = store.getState().user.get('id')

		if (!user) errors.url = 'Please login'
        if (!url) errors.url = "Url can't be empty"
        else if (url && !isUrl(url)) errors.url = 'Something wrong with this url'

		return errors
	}
})
@connect(
	// stateToProps
	({mood, node, decision, loading, global}, ownProps) => {
        return ({mood, node, decision, loading, global, ...ownProps})},
	// dispatchToProps
    (dispatch, {moodSlug}) => ({
        insertNode(formValues) {
            const node = parseUrl(formValues.url)           
            extend(node, { moodSlug })
            dispatch(insertNode(node))
        },
        toggleDialog() {
            dispatch(actions.toggleDialog())
        },
        toggleControls(boolean) {
			// setTimeout(() => {
			// 	dispatch(toggleControls(boolean))
			// }, 1000);
			console.log('toggleControls', boolean);
			dispatch(toggleControls(boolean))
		},
    })
)
export default class NodesInsert extends Component {

	static propTypes = {
        moodSlug: PropTypes.string.isRequired
    }

    state = {
      url: '',
	  open: false,
      contentType: ''
    }

  toggleDialog = () => this.setState({open: !this.state.open})

render() {
	const { node, handleSubmit, onSubmit, insertNode, valid, toggleDialog, toggleControls, submitting } = this.props
    const { state, props } = this

    const actions = [
                        <FlatButton
                            label="Cancel"
                            primary={true}
                            onTouchTap={toggleDialog}
                        />,
                        <FlatButton
                            type="submit"
                            label="Submit"
                            primary={true}
                            disabled={!valid}
                            onTouchTap={handleSubmit}
                        />
                    ]

    return  <Form onSubmit={handleSubmit(insertNode)} className="NodesInsert">
                
                {/* BUTTON */}
				<FloatingActionButton
					secondary={true}
					onClick={toggleDialog}
				>
                    <ContentAdd />
                </FloatingActionButton>

                {/* DIALOG */}                
				<Dialog
					title="Add something"
					actions={actions} 
					modal={true}
					open={node.dialogIsOpen}
					onRequestClose={toggleDialog}
                    //onMouseEnter={toggleControls.bind(this, true)} // on mouseEnter?
					//onMouseLeave={toggleControls.bind(this, false)}
				>
                    <Field name="url" component={TextField} hintText="Url" disabled={submitting} autoFocus fullWidth />
				</Dialog>
                
	        </Form>
  }
}