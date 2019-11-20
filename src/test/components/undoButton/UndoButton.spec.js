import React from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { notificationsMiddleware, notifications } from '@redhat-cloud-services/frontend-components-notifications';
import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/files/ReducerRegistry';

import UndoButtonAdd from '../../../components/UndoButton/UndoButtonAdd';
import * as refresh from '../../../components/UndoButton/refreshPage';
import ReducersProviders, { defaultProvidersState } from '../../../redux/reducers/providers';

import { componentWrapperIntl } from '../../../Utilities/testsHelpers';
import { Button } from '@patternfly/react-core';
import { paths } from '../../../Routes';
import { MemoryRouter } from 'react-router-dom';
import { addMessage } from '../../../redux/actions/providers';

describe('UndoButton', () => {
    const middlewares = [thunk, notificationsMiddleware()];

    let initialProps;
    let values;
    let messageId;
    let store;

    const TITLE = 'title';
    const VARIANT = 'variant';
    const DESCRIPTION = 'description';

    beforeEach(() => {
        values = {
            xx: 'yy',
            zz: 'zz'
        };
        messageId = 12789456451;
        initialProps = {
            values,
            messageId
        };

        store = createStore(
            combineReducers({ providers: applyReducerHash(ReducersProviders, defaultProvidersState), notifications }),
            applyMiddleware(...middlewares)
        );
    });

    const clickOnButton = (wrapper) => {
        wrapper.find(Button).simulate('click');
        wrapper.update();
    };

    const wasRedirectedToWizard = (wrapper) => wrapper.find(MemoryRouter).instance().history.location.pathname === paths.sourcesNew;

    it('renders correctly', () => {
        const wrapper = mount(componentWrapperIntl(<UndoButtonAdd {...initialProps} />, store));

        expect(wrapper.find(Button)).toHaveLength(1);
    });

    it('should set values and redirect to the wizard path', () => {
        store.dispatch(addMessage(TITLE, VARIANT, DESCRIPTION, messageId));

        const wrapper = mount(componentWrapperIntl(<UndoButtonAdd {...initialProps} />, store, [paths.sources]));

        expect(store.getState().notifications).toHaveLength(1);

        clickOnButton(wrapper);

        expect(wasRedirectedToWizard(wrapper)).toEqual(true);
        expect(store.getState().providers.addSourceInitialValues).toEqual(values);
        expect(store.getState().notifications).toHaveLength(0);
    });

    it('should pass when no message', () => {
        const wrapper = mount(componentWrapperIntl(<UndoButtonAdd {...initialProps} />, store, [paths.sources]));

        clickOnButton(wrapper);

        expect(store.getState().notifications).toHaveLength(0);
    });

    it('should set refresh the page when on wizard', () => {
        refresh.refreshPage = jest.fn();

        const wrapper = mount(componentWrapperIntl(<UndoButtonAdd {...initialProps} />, store, [paths.sourcesNew]));

        clickOnButton(wrapper);

        expect(refresh.refreshPage).toHaveBeenCalled();
    });
});
