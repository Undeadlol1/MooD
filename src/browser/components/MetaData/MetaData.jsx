import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'

export class MetaData extends Component {
	render() {
		const {props} = this
		// copy+paste from https://megatags.co/#generate-tags
	    return  <Helmet>
					{/* COMMON TAGS */}
					<meta charset="utf-8" />
					<title>{props.title}</title>
					{/* Search Engine */}
					{/* 150 characters for SEO, 200 characters for Twitter & Facebook */}
					{/*<meta name="description" content="MooD - is the place where you share your mood with others" />*/}
					<meta name="image" content="http://moodx.ru/android-chrome-192x192.png" />
					{/* Schema.org for Google */}
					<meta itemprop="name" content={props.title} />
					{/*<meta itemprop="description" content="MooD - is the place where you share your mood with others" />*/}
					<meta itemprop="image" content="http://moodx.ru/android-chrome-192x192.png" />
					{/* Twitter */}
					<meta name="twitter:card" content="summary" />
					<meta name="twitter:title" content={props.title} />
					{/*<meta name="twitter:description" content="MooD - is the place where you share your mood with others" />*/}
					{/*<meta name="twitter:site" content="@publishehadle_sdd" />*/}
					{/*<meta name="twitter:creator" content="@auth_handledee" />*/}
					{/* Maximum dimension: 1024px x 512px; minimum dimension: 440px x 220px */}
					{/*<meta name="twitter:image:src" content="http://moodx.ru/android-chrome-192x192.png" />*/}
					{/* HTTPS URL to an iFrame player */}
					{/* TODO add 'videoId' property */}
					{/*<meta name="twitter:player" content="https://www.youtube.com/watch?v=EDJsVbSZb-Q" />*/}
					{/* Open Graph general (Facebook, Pinterest & Google+) */}
					<meta name="og:title" content={props.title} />
					{/*<meta name="og:description" content="MooD - is the place where you share your mood with others" />*/}
					{/* Recommended dimension: 1200px x 630px; minimum dimension: 600px x 315px */}
					{/*<meta name="og:image" content="http://moodx.ru/android-chrome-192x192.png" />*/}
					<meta name="og:url" content={props.appUrl} />
					{/* TODO: sietename or site title? */}
					<meta name="og:site_name" content={props.title} />
					{/* TODO dynamic locales */}
					<meta name="og:locale" content="ru_RU" />
					{/*<meta name="og:video" content="https://www.youtube.com/watch?v=EDJsVbSZb-Q" />*/}
					{/*<meta name="fb:admins" content="facebook_admin_id" />*/}
					{/*<meta name="fb:app_id" content="some_fb_id" />*/}
					<meta name="og:type" content="website" />
				</Helmet>

	}
}

MetaData.defaultProps = {
	title: process.env.APP_NAME,
	appUrl: process.env.URL,
}

MetaData.PropTypes = {
	title: PropTypes.string.isRequired,
	appUrl: PropTypes.string.isRequired,
}

export default MetaData