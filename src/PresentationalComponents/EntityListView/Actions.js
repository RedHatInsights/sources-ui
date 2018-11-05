import { Link, Redirect, withRouter } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownItem, DropdownPosition, KebabToggle } from '@patternfly/react-core';
import reduce from 'lodash/reduce';

import { viewDefinitions } from '../../views/viewDefinitions'

class Actions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        }
    }

    onToggle = (opened) => this.setState({isOpen: opened});

    onSelect = (event) => {
        event.stopPropagation();
        this.setState({isCollapsed: true});
    }

    dropdownLinks = (viewDefinitions, item_id) =>
        reduce(Object.keys(viewDefinitions), (acc, viewName) => (
            acc.push(
                <DropdownItem component="div" key={viewName}>
                    <Link to={`/source/${item_id}/${viewName}`}>Show {viewDefinitions[viewName].displayName}</Link>
                </DropdownItem>
            ) && acc
        ), []);

    render = () => {
        const item_id = this.props.item.id;

        return (
            <Dropdown
                position={DropdownPosition.right}
                toggle={<KebabToggle onToggle={this.onToggle}/>}
                isOpen={this.state.isOpen}
                onSelect={this.onSelect}
            >
                { this.dropdownLinks( viewDefinitions, item_id) }
                <DropdownItem component="div"><Link to={`/source/${item_id}`}>Show Details</Link></DropdownItem>
                <DropdownItem component="div"><Link to={'/source/fixme/' + item_id}>Edit Source</Link></DropdownItem>
                <DropdownItem component="div"><Link to={'/source/fixme/' + item_id}>Remove Source</Link></DropdownItem>
            </Dropdown>
        )
    }
}

Actions.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    })
};

export default Actions;
