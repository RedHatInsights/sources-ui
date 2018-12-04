import React, { Component } from 'react';
import { Dropdown, DropdownItem, DropdownPosition, KebabToggle } from '@patternfly/react-core';

export default class SimpleKebab extends Component {
    state = {
        isOpen: false
    }

    onToggle = (opened) => this.setState({isOpen: opened});

    render() {
        return (
            <Dropdown
                position={DropdownPosition.right}
                toggle={<KebabToggle onToggle={this.onToggle}/>}
                isOpen={this.state.isOpen}
                dropdownItems={this.props.dropdownItems} />
        )
    }
}
