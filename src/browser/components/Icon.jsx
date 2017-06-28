import PropTypes from 'prop-types'
import classNames from 'classnames'
import React, { Component } from 'react'
import extendObject from 'lodash/assignIn'
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
        const { className, size, color, style, hoverIcon, ...rest } = this.props
        const iconOptions = {
                                size,
                                name: this.state.currentIcon,
                                style: extendObject({color}, style),
                            }

        return  <FontAwesome
                    {...rest}
                    {...iconOptions}
                    className={classNames('Icon', className)}
                    onMouseEnter={this.toggleHoverIcon.bind(this, true)}
                    onMouseLeave={this.toggleHoverIcon.bind(this, false)}
                />
    }
}

Icon.defaultProps = {
    size: '2x',
    color: 'white',
}

Icon.propTypes = {
    size: PropTypes.string,
    color: PropTypes.string,
    hoverIcon: PropTypes.string,
}

export default Icon