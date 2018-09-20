import { Link, Redirect, withRouter } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownItem, DropdownPosition, KebabToggle } from '@patternfly/react-core';

class Actions extends React.Component {
  constructor(props) {
    super(props);
    this.onToggle = this.onToggle.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.state = {
      isOpen: false
    }
  }

  onToggle(opened) {
    this.setState({isOpen: opened});
  }

  onSelect(event) {
    event.stopPropagation();
    this.setState({isCollapsed: true});
  }

  render() {
    console.log(this.state);
    return (
      <Dropdown
        position={DropdownPosition.right}
        toggle={<KebabToggle onToggle={this.onToggle}/>}
        isOpen={this.state.isOpen}
        onSelect={this.onSelect}
      >
          <DropdownItem component='div'>{/**this.props.item.name**/}<Link to='/topologyui/vms/'>Show VMs</Link></DropdownItem>
          <DropdownItem component='div'><Link to={'/provider/' + this.props.item.id}>Show Details</Link></DropdownItem>
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
