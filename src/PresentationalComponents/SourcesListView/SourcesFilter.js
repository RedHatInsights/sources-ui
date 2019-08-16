import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SimpleTableFilter } from '@red-hat-insights/insights-frontend-components';

class SourcesFilter extends Component {
    constructor(props) {
        super(props);
    }

    onFilterButtonClick = (filterValue, column) => {
        console.log('filter click', column.value, filterValue);
        this.props.onFilter(column.value, filterValue);
    }

    render = () =>
        (<SimpleTableFilter
            options={{
                title: 'Filter By',
                items: this.props.columns
            }}
            onButtonClick={this.onFilterButtonClick}
        />)
}

SourcesFilter.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        title: PropTypes.string
    })).isRequired,
    onFilter: PropTypes.func.isRequired
};

export default SourcesFilter;
