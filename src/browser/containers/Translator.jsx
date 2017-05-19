import React, { Component } from 'react'
import { IntlProvider, addLocaleData } from 'react-intl'
import enData from 'react-intl/locale-data/en'
import ruData from 'react-intl/locale-data/ru'
import en from '../i18n/en'
import ru from '../i18n/ru'

addLocaleData([...enData, ...ruData]);

const messages = { en, ru }

if (process.env.SERVER) {
// https://formatjs.io/guides/runtime-environments/#server
// var areIntlLocalesSupported = require('intl-locales-supported');
// var localesMyAppSupports = ['en', 'ru'];
 
// if (global.Intl) {
//     // Determine if the built-in `Intl` has the locale data we need. 
//     if (!areIntlLocalesSupported(localesMyAppSupports)) {
//         // `Intl` exists, but it doesn't have the data we need, so load the 
//         // polyfill and replace the constructors with need with the polyfill's. 
//         require('intl');
//         Intl.NumberFormat   = IntlPolyfill.NumberFormat;
//         Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
//     }
// } else {
//     // No `Intl`, so use and load the polyfill. 
//     global.Intl = require('intl');
// }
}

export default class Translator extends Component {
    render() {
        const language = navigator.languages
                            ? navigator.languages[0]
                            : (navigator.language || navigator.userLanguage)
        return  <IntlProvider locale={language} messages={messages[language]}>
                    {this.props.children}
                </IntlProvider>
    }
}