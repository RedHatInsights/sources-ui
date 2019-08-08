import React from 'react';
import { mount } from 'enzyme';
import { TextListItem } from '@patternfly/react-core';
import { Route } from 'react-router-dom';
import { notificationsMiddleware } from '@red-hat-insights/insights-frontend-components/components/Notifications';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import AddApplicationSummary from '../../../components/AddApplication/AddApplicationSummary';
import { componentWrapperIntl } from '../../../Utilities/testsHelpers';
import { sourceTypesData } from '../../sourceTypesData';
import { sourcesDataGraphQl } from '../../sourcesData';
import { applicationTypesData } from '../../applicationTypesData';

describe('AddApplicationSummary', () => {
    let initialProps;
    let store;
    let initialEntry;
    const middlewares = [thunk, notificationsMiddleware()];
    let mockStore;

    beforeEach(() => {
        initialProps = {
            formOptions: {
                getState: () => ({ values: { application: '2' } })
            }
        };
        initialEntry = ['/add_application/23'];
        mockStore = configureStore(middlewares);
        store = mockStore({
            providers: {
                entities: sourcesDataGraphQl,
                appTypes: applicationTypesData.data,
                sourceTypes: sourceTypesData.data
            }
        });
    });

    it('renders correctly', () => {
        const wrapper = mount(componentWrapperIntl(
            <Route path="/add_application/:id" render={ (...args) => <AddApplicationSummary { ...args } {...initialProps}/> } />,
            store,
            initialEntry
        ));

        const source = sourcesDataGraphQl.find((x) => x.id === '23');
        const sourceType = sourceTypesData.data.find((x) => x.id === source.source_type_id);
        const applicationType = applicationTypesData.data.find((x) => x.id === '2');

        expect(wrapper.find(TextListItem).at(1).text()).toEqual(source.name);
        expect(wrapper.find(TextListItem).at(3).text()).toEqual(sourceType.product_name);
        expect(wrapper.find(TextListItem).at(5).text()).toEqual(applicationType.display_name);
    });
});
