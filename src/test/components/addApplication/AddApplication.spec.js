import React from 'react';
import { mount } from 'enzyme';
import { Card, Button, EmptyStateBody } from '@patternfly/react-core';
import { Route } from 'react-router-dom';
import { notificationsMiddleware } from '@red-hat-insights/insights-frontend-components/components/Notifications';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { CardSelect } from '@redhat-cloud-services/frontend-components-sources';
import * as redux from 'redux';

import SourcesFormRenderer from '../../../Utilities/SourcesFormRenderer';
import * as entities from '../../../api/entities';
import AddApplication from '../../../components/AddApplication/AddApplication';
import { componentWrapperIntl } from '../../../Utilities/testsHelpers';
import { sourceTypesData } from '../../sourceTypesData';
import { sourcesDataGraphQl } from '../../sourcesData';
import { applicationTypesData } from '../../applicationTypesData';
import AddApplicationDescription from '../../../components/AddApplication/AddApplicationDescription';
import Description from '../../../components/Description';
import AddApplicationSummary from '../../../components/AddApplication/AddApplicationSummary';
import * as actions from '../../../redux/actions/providers';
import FinishedStep from '../../../components/steps/FinishedStep';
import ErroredStep from '../../../components/steps/ErroredStep';
import LoadingStep from '../../../components/steps/LoadingStep';

describe('AddApplication', () => {
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
                sourceTypes: sourceTypesData.data,
                appTypesLoaded: true,
                sourceTypesLoaded: true
            }
        });
    });

    it('renders correctly', () => {
        const wrapper = mount(componentWrapperIntl(
            <Route path="/add_application/:id" render={ (...args) => <AddApplication { ...args }/> } />,
            store,
            initialEntry
        ));

        expect(wrapper.find(SourcesFormRenderer).length).toEqual(1);
        expect(wrapper.find(AddApplicationDescription).length).toEqual(1);
        expect(wrapper.find(CardSelect).length).toEqual(1);
        expect(wrapper.find(Card).length).toEqual(3);
        expect(wrapper.find(Description).length).toEqual(1);
        expect(wrapper.find(Button).at(1).text()).toEqual('Next');
    });

    it('renders correctly when there is no free application', () => {
        const wrapper = mount(componentWrapperIntl(
            <Route path="/add_application/:id" render={ (...args) => <AddApplication { ...args }/> } />,
            store,
            ['/add_application/408']
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
            <Route path="/add_application/:id" render={ (...args) => <AddApplication { ...args }/> } />,
            store,
            initialEntry
        ));

        expect(wrapper).toEqual({});
    });

    it('renders review', () => {
        const wrapper = mount(componentWrapperIntl(
            <Route path="/add_application/:id" render={ (...args) => <AddApplication { ...args }/> } />,
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
        actions.loadEntities = jest.fn();

        const wrapper = mount(componentWrapperIntl(
            <Route path="/add_application/:id" render={ (...args) => <AddApplication { ...args }/> } />,
            store,
            initialEntry
        ));

        wrapper.find(Card).first().simulate('click');
        wrapper.find(Button).at(1).simulate('click');
        wrapper.update();
        wrapper.find(Button).at(1).simulate('click');

        expect(entities.doCreateApplication).toHaveBeenCalledWith('23', '1');
        setImmediate(() => {
            wrapper.update();
            expect(actions.loadEntities).toHaveBeenCalled();
            expect(wrapper.find(FinishedStep).length).toEqual(1);
            done();
        });
    });

    it('catch errors after submit', (done) => {
        redux.bindActionCreators = jest.fn(x => x);
        entities.doCreateApplication = jest.fn(() => new Promise((_resolve, reject) => reject(
            { data: { errors: [{ detail: 'Something went wrong :(' }] } }
        )));
        actions.loadEntities = jest.fn();

        const wrapper = mount(componentWrapperIntl(
            <Route path="/add_application/:id" render={ (...args) => <AddApplication { ...args }/> } />,
            store,
            initialEntry
        ));

        wrapper.find(Card).first().simulate('click');
        wrapper.find(Button).at(1).simulate('click');
        wrapper.update();
        wrapper.find(Button).at(1).simulate('click');

        expect(entities.doCreateApplication).toHaveBeenCalledWith('23', '1');
        setImmediate(() => {
            wrapper.update();
            expect(actions.loadEntities).not.toHaveBeenCalled();
            expect(wrapper.find(ErroredStep).length).toEqual(1);
            expect(wrapper.find(EmptyStateBody).text().includes('Something went wrong :(')).toEqual(true);
            done();
        });
    });

    it('show loading step', (done) => {
        redux.bindActionCreators = jest.fn(x => x);
        entities.doCreateApplication = jest.fn(() => new Promise((resolve) => resolve('OK')));
        actions.loadEntities = jest.fn();

        const wrapper = mount(componentWrapperIntl(
            <Route path="/add_application/:id" render={ (...args) => <AddApplication { ...args }/> } />,
            store,
            initialEntry
        ));

        wrapper.find(Card).first().simulate('click');
        wrapper.find(Button).at(1).simulate('click');
        wrapper.update();
        wrapper.find(Button).at(1).simulate('click');
        wrapper.update();
        expect(wrapper.find(LoadingStep).length).toEqual(1);

        setImmediate(() => {
            done();
        });
    });
});
