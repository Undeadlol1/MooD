import React, { Component } from 'react'
import { IntlProvider, addLocaleData } from 'react-intl'
import enData from 'react-intl/locale-data/en'
import ruData from 'react-intl/locale-data/ru'
import en from '../i18n/en'
import ru from '../i18n/ru'

addLocaleData([...enData, ...ruData]);

const messages = { en, ru }

export default class Translator extends Component {
    render() {
        return  <IntlProvider locale="en" messages={messages}>
                    {this.props.children}
                </IntlProvider>
    }
}