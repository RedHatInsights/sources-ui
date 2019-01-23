import { Link } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownItem, DropdownPosition, KebabToggle } from '@patternfly/react-core';
import reduce from 'lodash/reduce';

import { viewDefinitions } from '../../views/viewDefinitions';

class Actions extends React.Component {
    state = {
        isOpen: false
    }

    onToggle = (opened) => this.setState({ isOpen: opened });

    onSelect = (event) => {
        event.stopPropagation();
        this.setState({ isCollapsed: true });
    }

    dropdownLinks = (viewDefinitions, item_id) =>
        reduce(Object.keys(viewDefinitions), (acc, viewName) => (
            acc.push(
                <DropdownItem component="div" key={viewName}>
                    <Link
                        key={`link_${item_id}/${viewName}`}
                        to={`/source/${item_id}/${viewName}`}>Show {viewDefinitions[viewName].displayName}
                    </Link>
                </DropdownItem>
            ) && acc
        ), []);

    render = () => {
        const item_id = this.props.item.id;

        const dropdownItems = [
            ...this.dropdownLinks(viewDefinitions, item_id),
            <DropdownItem key='link_show' component="div"><Link to={`/source/${item_id}`}>Show Details</Link></DropdownItem>,
            <DropdownItem key='link_edit' component="div"><Link to={'/source/fixme/' + item_id}>Edit Source</Link></DropdownItem>,
            <DropdownItem key='link_remove' component="div">
                <Link to={'/source/fixme/' + item_id}>Remove Source</Link>
            </DropdownItem>
        ];

        return (
            <Dropdown
                position={DropdownPosition.right}
                toggle={<KebabToggle onToggle={this.onToggle}/>}
                isOpen={this.state.isOpen}
                onSelect={this.onSelect}
                dropdownItems={dropdownItems} />
        );
    }
}

Actions.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    })
};

export default Actions;
