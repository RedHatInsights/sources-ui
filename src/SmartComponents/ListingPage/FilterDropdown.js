import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownItem, DropdownSeparator } from  '@patternfly/react-core';

export default class FilterDropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        };
    }

    onToggle = (isOpen) => this.setState({ isOpen });

    onSelect = (_event) => this.setState(prevState => ({ isOpen: !prevState.isOpen }));

    /* TODO */
    /* eslint react/jsx-key: "warn" */
    dropdownItems = () => [
        <DropdownItem>Link</DropdownItem>,
        <DropdownItem component="button">Action</DropdownItem>,
        <DropdownItem isDisabled>Disabled Link</DropdownItem>,
        <DropdownItem isDisabled component="button">
            Disabled Action
        </DropdownItem>,
        <DropdownSeparator />,
        <DropdownItem>Separated Link</DropdownItem>,
        <DropdownItem component="button">Separated Action</DropdownItem>
    ]

    render = () =>
        (<Dropdown
            onToggle={this.onToggle}
            onSelect={this.onSelect}
            toggle={<DropdownToggle onToggle={this.onToggle}>All</DropdownToggle>}
            isOpen={this.state.isOpen}
            dropdownItems={this.dropdownItems()}
        />)
}
