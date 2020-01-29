import React from 'react';
import { mount } from 'enzyme';
import { Text, Button, Title } from '@patternfly/react-core';
import { Route } from 'react-router-dom';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { FormattedMessage } from 'react-intl';

import AddApplicationDescription from '../../../components/AddApplication/AddApplicationDescription';
import { componentWrapperIntl } from '../../../Utilities/testsHelpers';
import { sourceTypesData } from '../../sourceTypesData';
import { sourcesDataGraphQl } from '../../sourcesData';
import { applicationTypesData } from '../../applicationTypesData';
import RemoveAppModal from '../../../components/AddApplication/RemoveAppModal';
import ApplicationList from '../../../components/ApplicationsList/ApplicationList';

describe('AddApplicationDescription', () => {
    let store;
    let initialEntry;
    const middlewares = [thunk, notificationsMiddleware()];
    let mockStore;

    beforeEach(() => {
        initialEntry = ['/add_application/23'];
        mockStore = configureStore(middlewares);
        store = mockStore({
            sources: {
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

        expect(wrapper.find(Text).at(3).text()).toEqual(source.name);
        expect(wrapper.find(Text).at(4).text()).toEqual(sourceType.product_name);
        expect(wrapper.find(ApplicationList).length).toEqual(0);
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

        expect(wrapper.find(Text).at(3).text()).toEqual(source.name);
        expect(wrapper.find(Text).at(4).text()).toEqual(sourceType.product_name);
        expect(wrapper.find(ApplicationList).length).toEqual(1);
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

        expect(wrapper.find(Text).at(3).text()).toEqual(source.name);
        expect(wrapper.find(Text).at(4).text()).toEqual(sourceType.product_name);
        expect(wrapper.find(ApplicationList).length).toEqual(1);
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

    it('show remove app modal and close it', () => {
        const wrapper = mount(componentWrapperIntl(
            <Route path="/add_application/:id" render={ (...args) => <AddApplicationDescription { ...args }/> } />,
            store,
            ['/add_application/406']
        ));

        expect(wrapper.find(RemoveAppModal).length).toEqual(0);

        wrapper.find(Button).first().simulate('click');
        wrapper.update();
        expect(wrapper.find(RemoveAppModal).length).toEqual(1);

        wrapper.find(Button).at(0).simulate('click');
        wrapper.update();
        expect(wrapper.find(RemoveAppModal).length).toEqual(0);
    });

    it('renders correctly when SourceType does not exist', () => {
        const NOT_FOUND_MSG = 'Type not found';
        store = mockStore({
            sources: {
                entities: sourcesDataGraphQl,
                appTypes: applicationTypesData.data,
                sourceTypes: []
            }
        });

        const wrapper = mount(componentWrapperIntl(
            <Route path="/add_application/:id" render={ (...args) => <AddApplicationDescription { ...args }/> } />,
            store,
            initialEntry
        ));

        expect(wrapper.find(Text).at(4).text()).toEqual(NOT_FOUND_MSG);
    });
});
