import React from 'react';
import { mount } from 'enzyme';
import ContentLoader from 'react-content-loader';
import { RowWrapper } from '@patternfly/react-table';

import { PlaceHolderTable, RowLoader, RowWrapperLoader } from '../../../components/SourcesSimpleView/loaders';

describe('loaders', () => {
    describe('PlaceholderTable', () => {
        it('renders correctly', () => {
            const wrapper = mount(<PlaceHolderTable />);

            expect(wrapper.find('table').length).toEqual(1);
            expect(wrapper.find(RowLoader).length).toEqual(2);
        });
    });

    describe('RowLoader', () => {
        it('renders correctly', () => {
            const wrapper = mount(<RowLoader />);

            expect(wrapper.find(ContentLoader).length).toEqual(1);
        });
    });

    describe('RowWrapperLoader', () => {
        const row = {
            cells: ['CellText']
        };

        it('renders loader when item is deleting', () => {
            const wrapper = mount(<RowWrapperLoader row={{ ...row, isDeleting: true }} />);

            expect(wrapper.find(RowLoader).length).toEqual(1);
            expect(wrapper.find(RowWrapper).length).toEqual(0);
        });

        it('renders rowWrapper when item is not deleting', () => {
            const wrapper = mount(<RowWrapperLoader row={row} />);

            expect(wrapper.find(RowLoader).length).toEqual(0);
            expect(wrapper.find(RowWrapper).length).toEqual(1);
        });
    });
});
