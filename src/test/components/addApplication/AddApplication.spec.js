import React from 'react';
import { mount } from 'enzyme';
import { Card, Button, EmptyStateBody } from '@patternfly/react-core';
import { Route } from 'react-router-dom';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { CardSelect } from '@redhat-cloud-services/frontend-components-sources';
import * as redux from 'redux';

import SourcesFormRenderer from '../../../Utilities/SourcesFormRenderer';
import * as entities from '../../../api/entities';
import AddApplication from '../../../components/AddApplication/AddApplication';
import { componentWrapperIntl } from '../../../Utilities/testsHelpers';
import { sourceTypesData } from '../../sourceTypesData';
import { sourcesDataGraphQl, SOURCE_ALL_APS_ID, SOURCE_NO_APS_ID } from '../../sourcesData';
import { applicationTypesData } from '../../applicationTypesData';
import AddApplicationDescription from '../../../components/AddApplication/AddApplicationDescription';
import Description from '../../../components/Description';
import AddApplicationSummary from '../../../components/AddApplication/AddApplicationSummary';
import FinishedStep from '../../../components/steps/FinishedStep';
import ErroredStep from '../../../components/steps/ErroredStep';
import LoadingStep from '../../../components/steps/LoadingStep';
import { paths } from '../../../Routes';

describe('AddApplication', () => {
    let store;
    let initialEntry;
    let mockStore;
    const middlewares = [thunk, notificationsMiddleware()];
    const PATH = '/manage_apps/';

    beforeEach(() => {
        initialEntry = [`${PATH}${SOURCE_NO_APS_ID}`];
        mockStore = configureStore(middlewares);
        store = mockStore({
            providers: {
                entities: sourcesDataGraphQl,
                appTypes: applicationTypesData.data,
                sourceTypes: sourceTypesData.data,
                appTypesLoaded: true,
                sourceTypesLoaded: true
            }
        });
    });

    it('renders limited options of applications correctly', () => {
        const wrapper = mount(componentWrapperIntl(
            <Route path={paths.sourceManageApps} render={ (...args) => <AddApplication { ...args }/> } />,
            store,
            initialEntry
        ));

        expect(wrapper.find(SourcesFormRenderer).length).toEqual(1);
        expect(wrapper.find(AddApplicationDescription).length).toEqual(1);
        expect(wrapper.find(CardSelect).length).toEqual(1);
        expect(wrapper.find(Card).length).toEqual(2); // one app is not compatible
        expect(wrapper.find(Description).length).toEqual(1);
        expect(wrapper.find(Button).at(1).text()).toEqual('Next');
    });

    it('renders correctly when there is no free application', () => {
        const wrapper = mount(componentWrapperIntl(
            <Route path={paths.sourceManageApps} render={ (...args) => <AddApplication { ...args }/> } />,
            store,
            [`${PATH}${SOURCE_ALL_APS_ID}`]
        ));

        expect(wrapper.find(SourcesFormRenderer).length).toEqual(1);
        expect(wrapper.find(AddApplicationDescription).length).toEqual(1);
        expect(wrapper.find(CardSelect).length).toEqual(0);
        expect(wrapper.find(Card).length).toEqual(0);
        expect(wrapper.find(Description).length).toEqual(2); // + warning that all applications have already been added
        expect(wrapper.find(Button).at(4).text()).toEqual('Finish');
    });

    it('renders null when is not loaded', () => {
        store = mockStore({
            providers: {
                entities: [],
                appTypes: applicationTypesData.data,
                sourceTypes: sourceTypesData.data,
                appTypesLoaded: false,
                sourceTypesLoaded: true
            }
        });

        const wrapper = mount(componentWrapperIntl(
            <Route path={paths.sourceManageApps} render={ (...args) => <AddApplication { ...args }/> } />,
            store,
            initialEntry
        ));

        expect(wrapper).toEqual({});
    });

    it('renders review', () => {
        const wrapper = mount(componentWrapperIntl(
            <Route path={paths.sourceManageApps} render={ (...args) => <AddApplication { ...args }/> } />,
            store,
            initialEntry
        ));

        wrapper.find(Card).first().simulate('click');
        wrapper.find(Button).at(1).simulate('click');
        wrapper.update();

        expect(wrapper.find(Button).at(1).text()).toEqual('Finish');
        expect(wrapper.find(AddApplicationSummary).length).toEqual(1);
    });

    it('calls on submit function', (done) => {
        redux.bindActionCreators = jest.fn(x => x);
        entities.doCreateApplication = jest.fn(() => new Promise((resolve) => resolve('OK')));

        const wrapper = mount(componentWrapperIntl(
            <Route path={paths.sourceManageApps} render={ (...args) => <AddApplication { ...args }/> } />,
            store,
            initialEntry
        ));

        wrapper.find(Card).first().simulate('click');
        wrapper.find(Button).at(1).simulate('click');
        wrapper.update();
        wrapper.find(Button).at(1).simulate('click');

        expect(entities.doCreateApplication).toHaveBeenCalledWith(SOURCE_NO_APS_ID, '2');
        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(FinishedStep).length).toEqual(1);
            done();
        });
    });

    it('catch errors after submit', (done) => {
        const ERROR_MESSAGE = 'Something went wrong :(';

        redux.bindActionCreators = jest.fn(x => x);
        entities.doCreateApplication = jest.fn(() => new Promise((_resolve, reject) => reject(
            { data: { errors: [{ detail: ERROR_MESSAGE }] } }
        )));

        const wrapper = mount(componentWrapperIntl(
            <Route path={paths.sourceManageApps} render={ (...args) => <AddApplication { ...args }/> } />,
            store,
            initialEntry
        ));

        wrapper.find(Card).first().simulate('click');
        wrapper.find(Button).at(1).simulate('click');
        wrapper.update();
        wrapper.find(Button).at(1).simulate('click');

        expect(entities.doCreateApplication).toHaveBeenCalledWith(SOURCE_NO_APS_ID, '2');
        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(ErroredStep).length).toEqual(1);
            expect(wrapper.find(EmptyStateBody).text().includes(ERROR_MESSAGE)).toEqual(true);
            done();
        });
    });

    it('show loading step', () => {
        redux.bindActionCreators = jest.fn(x => x);
        entities.doCreateApplication = jest.fn(() => new Promise((resolve) => resolve('OK')));

        const wrapper = mount(componentWrapperIntl(
            <Route path={paths.sourceManageApps} render={ (...args) => <AddApplication { ...args }/> } />,
            store,
            initialEntry
        ));

        wrapper.find(Card).first().simulate('click');
        wrapper.find(Button).at(1).simulate('click');
        wrapper.update();
        wrapper.find(Button).at(1).simulate('click');
        wrapper.update();
        expect(wrapper.find(LoadingStep).length).toEqual(1);
    });
});
