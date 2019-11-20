import React from 'react';
import { useDispatch } from 'react-redux';
import { SimpleTableFilter } from '@redhat-cloud-services/frontend-components';
import { useIntl } from 'react-intl';
import { filterProviders } from '../redux/actions/providers';

const SourcesFilter = () =>{
    const intl = useIntl();
    const dispatch = useDispatch();

    return (
        <SimpleTableFilter
            buttonTitle={null}
            placeholder={
                intl.formatMessage({
                    id: 'sources.filterBySourceName',
                    defaultMessage: 'Filter by source name'
                })
            }
            onFilterChange={(args) => dispatch(filterProviders(args))}
        />
    );
};

export default SourcesFilter;
