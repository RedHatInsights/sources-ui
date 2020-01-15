import React from 'react';
import { Bullseye, Button, EmptyState, EmptyStateBody } from '@patternfly/react-core';

import { componentWrapperIntl } from '../../../Utilities/testsHelpers';
import EmptyStateTable from '../../../components/SourcesSimpleView/EmptyStateTable';
import * as actions from '../../../redux/actions/sources';

describe('EmptyStateTable', () => {
    it('render correctly', () => {
        const wrapper = mount(componentWrapperIntl(<EmptyStateTable />));

        expect(wrapper.find(Bullseye)).toHaveLength(1);
        expect(wrapper.find(Button)).toHaveLength(1);
        expect(wrapper.find(EmptyState)).toHaveLength(1);
        expect(wrapper.find(EmptyStateBody)).toHaveLength(1);
    });

    it('calls clear filters when click on button', () => {
        actions.clearFilters = jest.fn().mockImplementation(() => ({ type: 'cosi' }));

        const wrapper = mount(componentWrapperIntl(<EmptyStateTable />));

        wrapper.find(Button).simulate('click');

        expect(actions.clearFilters).toHaveBeenCalled();
    });
});
