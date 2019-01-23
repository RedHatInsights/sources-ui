import React, { Component } from 'react';
import { Dropdown, DropdownPosition, KebabToggle } from '@patternfly/react-core';
import PropTypes from 'prop-types';

export default class SimpleKebab extends Component {
    static propTypes = {
        dropdownItems: PropTypes.any.isRequired
    }

    state = {
        isOpen: false
    }

    onToggle = (opened) => this.setState({ isOpen: opened });

    render() {
        return (
            <Dropdown
                position={DropdownPosition.right}
                toggle={<KebabToggle onToggle={this.onToggle}/>}
                isOpen={this.state.isOpen}
                dropdownItems={this.props.dropdownItems} />
        );
    }
}
