import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { parseUrl } from '../helpers.js'
// import { nodesInsert } from '../../api/nodes'
import { If } from './Utils.jsx'
import { insertNode, actions } from '../redux/actions/NodeActions'
import { toggleControls } from '../redux/actions/GlobalActions'
// import isUrl from 'validator/lib/isUrl'
import validator from 'validator'
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
import Loading from './Loading'

@reduxForm({
	form: 'NodesInsert',
    // asyncValidate(values) {
    //     fetch('api')
    // },
	validate({url}, second) {
		const errors = {}
        if (!url) errors.url = 'Must not be empty!'
        else if (url && !ivalidator.sUrl(url)) errors.url = 'Thats not a proper url!'
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