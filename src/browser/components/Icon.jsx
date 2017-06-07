import PropTypes from 'prop-types'
import React, { Component } from 'react'
import FontAwesome from 'react-fontawesome'

class Icon extends Component {
    state = {
        currentIcon: this.props.name
    }

    toggleHoverIcon = isHovering => {
        const { name, hoverIcon } = this.props
        const currentIcon = isHovering ? hoverIcon : name
        if (hoverIcon) this.setState({ currentIcon })
    }

    render() {
        const { size, style, hoverIcon, ...rest } = this.props
        const iconOptions = {
                                name: this.state.currentIcon,
                                size: size || "2x",
                                style: style || {color: 'white'}
                            }
        return  <FontAwesome
                    {...rest}
                    {...iconOptions}
                    onMouseEnter={this.toggleHoverIcon.bind(this, true)}
                    onMouseLeave={this.toggleHoverIcon.bind(this, false)}
                />
    }
}

Icon.propTypes = {
    hoverIcon: PropTypes.string
}

export default Icon