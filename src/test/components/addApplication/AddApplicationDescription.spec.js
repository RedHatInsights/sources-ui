import React from 'react';
import { mount } from 'enzyme';
import { Text, Button, Title } from '@patternfly/react-core';
import { Route } from 'react-router-dom';
import { notificationsMiddleware } from '@red-hat-insights/insights-frontend-components/components/Notifications';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { FormattedMessage } from 'react-intl';

import AddApplicationDescription from '../../../components/AddApplication/AddApplicationDescription';
import { componentWrapperIntl } from '../../../Utilities/testsHelpers';
import { sourceTypesData } from '../../sourceTypesData';
import { sourcesDataGraphQl } from '../../sourcesData';
import { applicationTypesData } from '../../applicationTypesData';
import RemoveAppModal from '../../../components/AddApplication/RemoveAppModal';

describe('AddApplicationDescription', () => {
    let store;
    let initialEntry;
    const middlewares = [thunk, notificationsMiddleware()];
    let mockStore;

    beforeEach(() => {
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
            <Route path="/add_application/:id" render={ (...args) => <AddApplicationDescription { ...args }/> } />,
            store,
            initialEntry
        ));

        const source = sourcesDataGraphQl.find((x) => x.id === '23');
        const sourceType = sourceTypesData.data.find((x) => x.id === source.source_type_id);

        expect(wrapper.find(Text).at(4).text()).toEqual(source.name);
        expect(wrapper.find(Text).at(5).text()).toEqual(sourceType.product_name);
        expect(wrapper.find(FormattedMessage).last().text()).toEqual('No applications');
        expect(wrapper.find(Button).length).toEqual(0);
    });

    it('renders correctly with application', () => {
        const wrapper = mount(componentWrapperIntl(
            <Route path="/add_application/:id" render={ (...args) => <AddApplicationDescription { ...args }/> } />,
            store,
            ['/add_application/406']
        ));

        const source = sourcesDataGraphQl.find((x) => x.id === '406');
        const sourceType = sourceTypesData.data.find((x) => x.id === source.source_type_id);
        const applicationType = applicationTypesData.data.find((x) => x.id === source.applications[0].application_type_id);

        expect(wrapper.find(Text).at(4).text()).toEqual(source.name);
        expect(wrapper.find(Text).at(5).text()).toEqual(sourceType.product_name);
        expect(wrapper.find(Text).at(6).text()).toEqual(applicationType.display_name);
        expect(wrapper.find(Button).length).toEqual(1);
    });

    it('renders correctly with applications', () => {
        const wrapper = mount(componentWrapperIntl(
            <Route path="/add_application/:id" render={ (...args) => <AddApplicationDescription { ...args }/> } />,
            store,
            ['/add_application/408']
        ));

        const source = sourcesDataGraphQl.find((x) => x.id === '408');
        const sourceType = sourceTypesData.data.find((x) => x.id === source.source_type_id);
        const applicationType = applicationTypesData.data.find((x) => x.id === source.applications[0].application_type_id);
        const applicationType1 = applicationTypesData.data.find((x) => x.id === source.applications[1].application_type_id);
        const applicationType2 = applicationTypesData.data.find((x) => x.id === source.applications[2].application_type_id);

        expect(wrapper.find(Text).at(4).text()).toEqual(source.name);
        expect(wrapper.find(Text).at(5).text()).toEqual(sourceType.product_name);
        expect(wrapper.find(Text).at(6).text()).toEqual(applicationType.display_name);
        expect(wrapper.find(Text).at(7).text()).toEqual(applicationType1.display_name);
        expect(wrapper.find(Text).at(8).text()).toEqual(applicationType2.display_name);
        expect(wrapper.find(Button).length).toEqual(3);
    });

    it('show remove app modal', () => {
        const wrapper = mount(componentWrapperIntl(
            <Route path="/add_application/:id" render={ (...args) => <AddApplicationDescription { ...args }/> } />,
            store,
            ['/add_application/406']
        ));

        const source = sourcesDataGraphQl.find((x) => x.id === '406');
        const applicationType = applicationTypesData.data.find((x) => x.id === source.applications[0].application_type_id);

        wrapper.find(Button).first().simulate('click');

        wrapper.update();
        expect(wrapper.find(RemoveAppModal).length).toEqual(1);
        expect(wrapper.find(Title).first().text().includes(applicationType.display_name)).toEqual(true);
    });
});
