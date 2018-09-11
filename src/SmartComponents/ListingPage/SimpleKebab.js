import React, { Component } from 'react';
import { Dropdown, DropdownItem, DropdownPosition, KebabToggle } from '@patternfly/react-core';

export default class SimpleKebab extends Component {
  constructor(props) {
    super(props);
    this.onToggle = this.onToggle.bind(this);
    this.state = {
      isOpen: false
    }
  }

  onToggle(opened) {
    this.setState({isOpen: opened});
  }

  render() {
    const { children } = this.props;

    return (
      <Dropdown
        position={DropdownPosition.right}
        toggle={<KebabToggle onToggle={this.onToggle}/>}
        isOpen={this.state.isOpen}
      >
        {children}
      </Dropdown>
    )
  }
}
