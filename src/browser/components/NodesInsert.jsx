import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { parseUrl } from '../../shared/parsers.js'
import { If } from './Utils.jsx'
import { insertNode, actions } from '../redux/actions/NodeActions'
import { toggleControls } from '../redux/actions/GlobalActions'
import { assignIn as extend, isEmpty } from 'lodash'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import {white} from 'material-ui/styles/colors';
import ContentAdd from 'material-ui/svg-icons/content/add'
import { Form, Field, reduxForm } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import { history } from 'react-router';
import store from '../redux/store'
import { FormattedMessage } from 'react-intl';
import { translate } from '../containers/Translator'
import { parseJSON, checkStatus } from '../redux/actions/actionHelpers'
import isUrl from 'is-url'

@reduxForm({
	form: 'NodesInsert',
    // check if node already exists or not
	asyncValidate(values, dispatch, props) {
		return fetch(`/api/nodes/validate`
                     + `/${store.getState().mood.get('id')}`
                     + `/${parseUrl(values.url).contentId}`
                )
				.then(parseJSON)
				.then(node => {
					if (!isEmpty(node)) throw {
                        url: translate('this_video_already_exists_please_no_duplicates')
                    }
					else return
                })
    },
    asyncBlurFields: [ 'url' ],
    // validate user and url
	validate({url}, second) {
		let errors = {}
        const user = store.getState().user.get('id')
		if (!user) errors.url = translate('please_login')
        if (!url) errors.url = translate('url_cant_be_empty')
        else if (url && !isUrl(url)) errors.url = translate('something_wrong_with_this_url')
		return errors
	}
})
@connect(
	// stateToProps
	({mood, node}, ownProps) => 
    ({mood, node, ...ownProps}),
	// dispatchToProps
    (dispatch, ownProps) => ({
        insertNode(formValues) {
            const { moodSlug } = ownProps
            // TODO parseUrl is not really needed anymore. Parsing is made on server side. Remove this?
            const node = parseUrl(formValues.url)
            extend(node, { moodSlug })
            dispatch(insertNode(node))
            ownProps.reset()
        },
        toggleDialog() {
            dispatch(actions.toggleDialog())
        },
        toggleControls(boolean) {
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
	const { handleSubmit, onSubmit, insertNode, valid, toggleDialog, toggleControls, submitting, asyncValidating } = this.props
    const { state, props } = this
    const isDisabled = asyncValidating == 'url' || submitting

    const actions = [
                        <FlatButton
                            primary={true}
                            onTouchTap={toggleDialog}
                            label={translate("cancel")}
                            disabled={isDisabled}
                        />,
                        <FlatButton
                            type="submit"
                            primary={true}
                            disabled={!valid}
                            onTouchTap={handleSubmit}
                            label={translate("submit")}
                            disabled={isDisabled}
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
					title={translate("add_something")}
					actions={actions} 
					modal={true}
					open={props.node.dialogIsOpen}
					onRequestClose={toggleDialog}
				>
                    <Field name="url" component={TextField} hintText="Url" disabled={isDisabled} autoFocus fullWidth />
				</Dialog>
                
	        </Form>
  }
}