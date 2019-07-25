import React from 'react';
import PropTypes from 'prop-types';
import { SimpleTableFilter } from '@red-hat-insights/insights-frontend-components';
import { injectIntl } from 'react-intl';

const SourcesFilter = ({ intl, onFilterSelect, onFilter, columns }) =>
    (<SimpleTableFilter
        buttonTitle={null}
        placeholder={
            intl.formatMessage({
                id: 'sources.filterBySourceName',
                defaultMessage: 'Filter by source name'
            })
        }
        xoptions={{
            title: intl.formatMessage({
                id: 'sources.filterBy',
                defaultMessage: 'Filter by'
            }),
            items: columns
        }}
        onOptionSelect={onFilterSelect}
        onButtonClick={onFilter}
        onFilterChange={onFilter}
    />);

SourcesFilter.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        title: PropTypes.string
    })).isRequired,
    onFilter: PropTypes.func.isRequired,
    onFilterSelect: PropTypes.func.isRequired,

    intl: PropTypes.object.isRequired
};

export default injectIntl(SourcesFilter);
