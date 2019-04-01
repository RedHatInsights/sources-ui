import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SimpleTableFilter } from '@red-hat-insights/insights-frontend-components';

class SourcesFilter extends Component {
    constructor(props) {
        super(props);
    }

    render = () =>
        <SimpleTableFilter
            options={{
                title: 'Filter By',
                items: this.props.columns
            }}
            onOptionSelect={this.props.onFilterSelect}
            onButtonClick={this.props.onFilter}
        />
}

SourcesFilter.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        title: PropTypes.string
    })).isRequired,
    onFilter: PropTypes.func.isRequired,
    onFilterSelect: PropTypes.func.isRequired
};

export default SourcesFilter;
