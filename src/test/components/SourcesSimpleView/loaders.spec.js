import React from 'react';
import { mount } from 'enzyme';
import ContentLoader from 'react-content-loader';

import { PlaceHolderTable, RowLoader } from '../../../components/SourcesSimpleView/loaders';

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
});
