import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { Row, Col } from 'react-materialize'
import { parseUrl } from '../helpers.js'
// import { nodesInsert } from '../../api/nodes'
import { If } from './Utils.jsx'
import { insertNode } from '../redux/actions/NodeActions'
import isUrl from 'validator/lib/isUrl'
import { assignIn as extend } from 'lodash'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import { Form, Field, reduxForm } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import { history } from 'react-router';

@reduxForm({
	form: 'NodesInsert',
	validate({url}, second) {
		const errors = {}
        //
        if (!url) errors.url = 'Must not be empty!'
        else if (url && !isUrl(url)) errors.url = 'Thats not a proper url!'
        // else submit()
        // try {
        //     this.setState({ contentType: parseUrl(url).type })
        // } catch (err) {
        //     console.warn(err);
        //     this.setState({ contentType: '' });
        // } finally {
        //     this.setState({url})
        // }
        // if (keyCode == 13) this.handleSubmit()
        //
		return errors
	}
})
@connect(
	// stateToProps
	({mood, node, decision, loading}, ownProps) => {
        ownProps
        return ({mood, node, decision, loading, ...ownProps})},
	// dispatchToProps
    (dispatch, {moodSlug}) => ({
        insertNode(formValues) {
            const node = parseUrl(formValues.url)           
            extend(node, { moodSlug })
            dispatch(insertNode(node))
        }
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
	const { handleSubmit, onSubmit, insertNode, valid, toggleDialog } = this.props
    const { state, props } = this
    // console.log('props.isValid', props.isValid);
    // console.log('props', props);
    // console.log('history', history);

			const actions = [
								<FlatButton
                                    label="Cancel"
                                    primary={true}
                                    onTouchTap={this.toggleDialog}
								/>,
								<FlatButton
                                    type="submit"
                                    label="Submit"
                                    primary={true}
                                    disabled={!valid}
                                    onTouchTap={handleSubmit}
								/>
							]

    return  <Form onSubmit={handleSubmit(insertNode)}>
				<RaisedButton
					icon={<ContentAdd />}
					onClick={this.toggleDialog}
					secondary={true}
				/>
				<Dialog
					title="Add something"
					actions={actions} 
					modal={false}
					open={state.open}
					onRequestClose={this.toggleDialog}
				>
                    <Field name="url" component={TextField} hintText="Url" autoFocus fullWidth />
				</Dialog>
	        </Form>
  }
}

{/*<If condition={state.contentType == 'video'}>
    <p>Тип контента: {state.contentType}</p>
    <p>Видео важно? Или только звук?</p>
    <div className="switch">
        <label>
        Заменить видео чем-нибудь интересным
        <input type="checkbox" checked />
        <span className="lever" />
        Показывать видео
        </label>
    </div>
</If>
<If condition={state.contentType == 'image'}>
    <p>Тип контента: {state.contentType}</p>
</If>*/}