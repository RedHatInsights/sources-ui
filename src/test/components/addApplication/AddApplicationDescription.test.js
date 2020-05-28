import React from 'react';
import { mount } from 'enzyme';
import { Text, Button } from '@patternfly/react-core';
import { Route } from 'react-router-dom';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { FormattedMessage } from 'react-intl';

import AddApplicationDescription from '../../../components/AddApplication/AddApplicationDescription';
import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import { sourceTypesData } from '../../__mocks__/sourceTypesData';
import { sourcesDataGraphQl } from '../../__mocks__/sourcesData';
import { applicationTypesData } from '../../__mocks__/applicationTypesData';
import RemoveAppModal from '../../../components/AddApplication/RemoveAppModal';
import ApplicationList from '../../../components/ApplicationsList/ApplicationList';
import { routes, replaceRouteId } from '../../../Routes';

describe('AddApplicationDescription', () => {
    let store;
    let initialEntry;
    const middlewares = [thunk, notificationsMiddleware()];
    let mockStore;
    let initialProps;

    beforeEach(() => {
        initialProps = {
            container: document.createElement('div')
        };
        initialEntry = [replaceRouteId(routes.sourceManageApps.path, '23')];
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
            <Route path={routes.sourceManageApps.path} render={ (...args) => <AddApplicationDescription {...initialProps} { ...args }/> } />,
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
        expect(initialProps.container.hidden).toEqual(false);
    });

    it('renders correctly with application', () => {
        const wrapper = mount(componentWrapperIntl(
            <Route path={routes.sourceManageApps.path} render={ (...args) => <AddApplicationDescription {...initialProps} { ...args }/> } />,
            store,
            [replaceRouteId(routes.sourceManageApps.path, '406')]
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
            <Route path={routes.sourceManageApps.path} render={ (...args) => <AddApplicationDescription {...initialProps} { ...args }/> } />,
            store,
            [replaceRouteId(routes.sourceManageApps.path, '408')]
        ));

        const source = sourcesDataGraphQl.find((x) => x.id === '408');
        const sourceType = sourceTypesData.data.find((x) => x.id === source.source_type_id);

        expect(wrapper.find(Text).at(3).text()).toEqual(source.name);
        expect(wrapper.find(Text).at(4).text()).toEqual(sourceType.product_name);
        expect(wrapper.find(ApplicationList).length).toEqual(1);
        expect(wrapper.find(Button).length).toEqual(3);
    });

    it('show remove app modal and close it', () => {
        const wrapper = mount(componentWrapperIntl(
            <Route path={routes.sourceManageApps.path} render={ (...args) => <AddApplicationDescription {...initialProps} { ...args }/> } />,
            store,
            [replaceRouteId(routes.sourceManageApps.path, '406')]
        ));

        expect(wrapper.find(RemoveAppModal).length).toEqual(0);

        wrapper.find(Button).first().simulate('click');
        wrapper.update();
        expect(wrapper.find(RemoveAppModal).length).toEqual(1);
        expect(initialProps.container.hidden).toEqual(true);

        wrapper.find(Button).at(0).simulate('click');
        wrapper.update();
        expect(wrapper.find(RemoveAppModal).length).toEqual(0);
        expect(initialProps.container.hidden).toEqual(false);
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
            <Route path={routes.sourceManageApps.path} render={ (...args) => <AddApplicationDescription {...initialProps} { ...args }/> } />,
            store,
            initialEntry
        ));

        expect(wrapper.find(Text).at(4).text()).toEqual(NOT_FOUND_MSG);
    });
});
