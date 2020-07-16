import React from 'react';
import { mount } from 'enzyme';
import { Modal, Button, Text } from '@patternfly/react-core';
import configureStore from 'redux-mock-store';
import { Route } from 'react-router-dom';
import { act } from 'react-dom/test-utils';

import RemoveAppModal from '../../../components/AddApplication/RemoveAppModal';
import * as actions from '../../../redux/sources/actions';
import { routes, replaceRouteId } from '../../../Routes';
import { componentWrapperIntl } from '../../../utilities/testsHelpers';

describe('RemoveAppModal', () => {
    let store;
    let mockStore;
    let initialProps;
    let spyOnCancel;
    let initialEntry;
    let initialStore;

    const APP_ID = '187894151315';
    const SOURCE_ID = '15';
    const SUCCESS_MSG = expect.any(String);
    const ERROR_MSG = expect.any(String);

    const APP1 = 'APP_1';
    const APP2 = 'APP_2';
    const APP1_DISPLAY_NAME = 'APP_1';
    const APP2_DISPLAY_NAME = 'APP_2';
    const DEPENDENT_APPS = [APP1, APP2];

    const APP_TYPES = [
        { name: APP1, display_name: APP1_DISPLAY_NAME },
        { name: APP2, display_name: APP2_DISPLAY_NAME }
    ];

    beforeEach(() => {
        initialStore = {
            sources: {
                appTypes: [],
                entities: [{ id: SOURCE_ID }]
            }
        };
        mockStore = configureStore();
        store = mockStore(initialStore);
        spyOnCancel = jest.fn();
        initialProps = {
            app: {
                id: APP_ID,
                display_name: 'Catalog',
                dependent_applications: []
            },
            onCancel: spyOnCancel,
            container: document.createElement('div')
        };
        initialEntry = [replaceRouteId(routes.sourceManageApps.path, SOURCE_ID)];
    });

    afterEach(() => {
        spyOnCancel.mockReset();
    });

    it('renders correctly', () => {
        const wrapper = mount(componentWrapperIntl(
            <Route path={routes.sourceManageApps.path} render={ (...args) =>  <RemoveAppModal {...args} {...initialProps} /> } />,
            store,
            initialEntry
        ));

        expect(wrapper.find(Modal).length).toEqual(1);
        expect(wrapper.find(Button).length).toEqual(3); // modal cancel, remove, cancel
        expect(wrapper.find(Button).at(1).text()).toEqual('Remove application');
        expect(wrapper.find(Button).last().text()).toEqual('Cancel');
    });

    it('renders correctly with attached dependent applications', () => {
        const ATTACHED_APPS = [APP1_DISPLAY_NAME, APP2_DISPLAY_NAME];
        const app = {
            ...initialProps.app,
            dependent_applications: DEPENDENT_APPS,
            sourceAppsNames: ATTACHED_APPS
        };

        store = mockStore({
            sources: {
                ...initialStore.sources,
                appTypes: APP_TYPES
            }
        });

        const wrapper = mount(componentWrapperIntl(
            <Route path={routes.sourceManageApps.path} render={ (...args) =>  <RemoveAppModal {...args} {...initialProps} app={app}/> } />,
            store,
            initialEntry
        ));

        expect(wrapper.find(Text)).toHaveLength(2);
        expect(wrapper.find(Text).last().html().includes(APP1_DISPLAY_NAME)).toEqual(true);
        expect(wrapper.find(Text).last().html().includes(APP2_DISPLAY_NAME)).toEqual(true);
    });

    it('renders correctly with unattached dependent applications', () => {
        const ATTACHED_APPS = [];
        const app = {
            ...initialProps.app,
            dependent_applications: DEPENDENT_APPS,
            sourceAppsNames: ATTACHED_APPS
        };

        store = mockStore({
            sources: {
                ...initialStore.sources,
                appTypes: APP_TYPES
            }
        });

        const wrapper = mount(componentWrapperIntl(
            <Route path={routes.sourceManageApps.path} render={ (...args) =>  <RemoveAppModal {...args} {...initialProps} app={app}/> } />,
            store,
            initialEntry
        ));

        expect(wrapper.find(Text)).toHaveLength(1);
        expect(wrapper.find(Text).last().html().includes(APP1_DISPLAY_NAME)).toEqual(false);
        expect(wrapper.find(Text).last().html().includes(APP2_DISPLAY_NAME)).toEqual(false);
    });

    it('hides container on render', async () => {
        let wrapper;

        expect(initialProps.container.hidden).toEqual(false);

        await act(async () => {
            wrapper = mount(componentWrapperIntl(
                <Route path={routes.sourceManageApps.path} render={ (...args) =>  <RemoveAppModal {...args} {...initialProps}/> } />,
                store,
                initialEntry
            ));
        });
        wrapper.update();

        expect(initialProps.container.hidden).toEqual(true);
    });

    it('calls cancel', () => {
        const wrapper = mount(componentWrapperIntl(
            <Route path={routes.sourceManageApps.path} render={ (...args) =>  <RemoveAppModal {...args} {...initialProps}/> } />,
            store,
            initialEntry
        ));

        wrapper.find(Button).last().simulate('click');
        expect(spyOnCancel).toHaveBeenCalled();
    });

    it('calls a submit and calls cancel', (done) => {
        actions.removeApplication = jest.fn().mockImplementation(() => ({ type: 'REMOVE_APP' }));

        const wrapper = mount(componentWrapperIntl(
            <Route path={routes.sourceManageApps.path} render={ (...args) =>  <RemoveAppModal {...args} {...initialProps}/> } />,
            store,
            initialEntry
        ));

        wrapper.find(Button).at(1).simulate('click');

        expect(actions.removeApplication).toHaveBeenCalledWith(APP_ID, SOURCE_ID, SUCCESS_MSG, ERROR_MSG);
        expect(spyOnCancel).toHaveBeenCalled();
        done();
    });
});
