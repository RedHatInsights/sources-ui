import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SimpleTableFilter } from '@red-hat-insights/insights-frontend-components';

class EntityFilter extends Component {
    constructor(props) {
        super(props);

        this.onFilterButtonClick  = this.onFilterButtonClick.bind(this);
        this.onFilterOptionSelect = this.onFilterOptionSelect.bind(this);

        this.state = {
        }
    }

    onFilterButtonClick(args) {
        console.log(args);
    }

    onFilterOptionSelect(field) {
        console.log(field);
        this.setState({
            filterField: field
        })
    }

    render() {
        return (
            <SimpleTableFilter
                options={{
                    title: 'Filter By',
                    items: this.props.columns
                }}
                onButtonClick={this.onFilterButtonClick}
                onOptionSelect={this.onFilterOptionSelect}
            />
        );
    }
}

EntityFilter.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.shape({
            value: PropTypes.string,
            title: PropTypes.string
    })).isRequired
}

export default EntityFilter;
