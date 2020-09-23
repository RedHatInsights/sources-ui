import React from 'react';
import { mount } from 'enzyme';
import { Radio } from '@patternfly/react-core';
import configureStore from 'redux-mock-store';
import { Route } from 'react-router-dom';
import { act } from 'react-dom/test-utils';

import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import { sourceTypesData } from '../../__mocks__/sourceTypesData';
import { sourcesDataGraphQl, SOURCE_ONE_APS_ID } from '../../__mocks__/sourcesData';
import { applicationTypesData } from '../../__mocks__/applicationTypesData';
import { replaceRouteId, routes } from '../../../Routes';
import SourcesFormRenderer from '../../../utilities/SourcesFormRenderer';
import RemoveAppModal from '../../../components/AddApplication/RemoveAppModal';

describe('ApplicationSelect', () => {
    let store;
    let mockStore;
    let initialProps;
    let initialEntry;
    let initialStore;
    let container;
    let onSubmit;

    beforeEach(() => {
        onSubmit = jest.fn();
        initialStore = {
            sources: {
                entities: sourcesDataGraphQl,
                appTypes: applicationTypesData.data,
                sourceTypes: sourceTypesData.data
            }
        };
        mockStore = configureStore();
        store = mockStore(initialStore);
        container = document.createElement('div');

        initialProps = {
            onSubmit,
            schema: {
                fields: [{
                    component: 'application-select',
                    name: 'app-select',
                    container,
                    options: [{
                        value: '1',
                        label: 'First app'
                    }, {
                        value: '2',
                        label: 'Second app'
                    }]
                }]
            }
        };
    });

    it('renders correctly with one free and taken application', () => {
        initialEntry = [replaceRouteId(routes.sourceManageApps.path, SOURCE_ONE_APS_ID)];

        const wrapper = mount(componentWrapperIntl(
            <Route path={routes.sourceManageApps.path} render={ (...args) => <SourcesFormRenderer {...initialProps} { ...args }/> } />,
            store,
            initialEntry
        ));

        expect(wrapper.find(Radio)).toHaveLength(1);
        expect(wrapper.find(Radio).props().label).toEqual('Second app');
        expect(wrapper.find(Radio).props().isDisabled).toEqual(false);
        expect(wrapper.find('.pf-c-radio')).toHaveLength(2);
        expect(wrapper.find('.pf-c-radio').first().find('label').text()).toEqual('First app');
        expect(wrapper.find(RemoveAppModal)).toHaveLength(0);
    });

    it('renders correctly with one free and taken application while taken application is being removed', () => {
        store = mockStore({
            sources: {
                ...initialStore.sources,
                entities: [{
                    id: SOURCE_ONE_APS_ID,
                    applications: [{
                        application_type_id: '1',
                        isDeleting: true,
                        id: '1234'
                    }]
                }]
            }
        });

        initialEntry = [replaceRouteId(routes.sourceManageApps.path, SOURCE_ONE_APS_ID)];

        initialProps.schema.fields[0].options = [{
            value: '1',
            label: 'First app'
        }];

        const wrapper = mount(componentWrapperIntl(
            <Route path={routes.sourceManageApps.path} render={ (...args) => <SourcesFormRenderer {...initialProps} { ...args }/> } />,
            store,
            initialEntry
        ));

        expect(wrapper.find(Radio)).toHaveLength(1);
        expect(wrapper.find(Radio).props().label).toEqual('First app');
        expect(wrapper.find(Radio).props().isDisabled).toEqual(true);
    });

    it('renders modal when click on trash icon', async () => {
        initialEntry = [replaceRouteId(routes.sourceManageApps.path, SOURCE_ONE_APS_ID)];

        const wrapper = mount(componentWrapperIntl(
            <Route path={routes.sourceManageApps.path} render={ (...args) => <SourcesFormRenderer {...initialProps} { ...args }/> } />,
            store,
            initialEntry
        ));

        expect(container.hidden).toEqual(false);
        expect(wrapper.find(RemoveAppModal)).toHaveLength(0);

        await act(async () => {
            wrapper.find('button#remove-app-1').simulate('click');
        });
        wrapper.update();

        expect(container.hidden).toEqual(true);
        expect(wrapper.find(RemoveAppModal)).toHaveLength(1);

        await act(async () => {
            wrapper.find('button#deleteCancel').simulate('click');
        });
        wrapper.update();

        expect(container.hidden).toEqual(false);
        expect(wrapper.find(RemoveAppModal)).toHaveLength(0);
    });

    it('select an application to add', async () => {
        initialEntry = [replaceRouteId(routes.sourceManageApps.path, SOURCE_ONE_APS_ID)];

        const wrapper = mount(componentWrapperIntl(
            <Route path={routes.sourceManageApps.path} render={ (...args) => <SourcesFormRenderer {...initialProps} { ...args }/> } />,
            store,
            initialEntry
        ));

        await act(async () => {
            wrapper.find('input').simulate('change');
        });
        wrapper.update();

        await act(async () => {
            wrapper.find('form').simulate('submit');
        });
        wrapper.update();

        expect(onSubmit).toHaveBeenCalledWith({
            'app-select': '2'
        }, expect.any(Object), expect.any(Function));
    });
});
