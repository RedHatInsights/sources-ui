import React from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { notificationsMiddleware, notifications } from '@redhat-cloud-services/frontend-components-notifications';
import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/files/ReducerRegistry';

import UndoButtonAdd from '../../../components/UndoButton/UndoButtonAdd';
import * as refresh from '../../../components/UndoButton/refreshPage';
import ReducersProviders, { defaultSourcesState } from '../../../redux/sources/reducer';

import { componentWrapperIntl } from '../../../Utilities/testsHelpers';
import { Button } from '@patternfly/react-core';
import { routes } from '../../../Routes';
import { MemoryRouter } from 'react-router-dom';
import { addMessage } from '../../../redux/sources/actions';

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
            combineReducers({ sources: applyReducerHash(ReducersProviders, defaultSourcesState), notifications }),
            applyMiddleware(...middlewares)
        );
    });

    const clickOnButton = (wrapper) => {
        wrapper.find(Button).simulate('click');
        wrapper.update();
    };

    const wasRedirectedToWizard = (wrapper) => wrapper.find(MemoryRouter).instance().history.location.pathname === routes.sourcesNew.path;

    it('renders correctly', () => {
        const wrapper = mount(componentWrapperIntl(<UndoButtonAdd {...initialProps} />, store));

        expect(wrapper.find(Button)).toHaveLength(1);
    });

    it('should set values and redirect to the wizard path', () => {
        store.dispatch(addMessage(TITLE, VARIANT, DESCRIPTION, messageId));

        const wrapper = mount(componentWrapperIntl(<UndoButtonAdd {...initialProps} />, store, [routes.sources.path]));

        expect(store.getState().notifications).toHaveLength(1);

        clickOnButton(wrapper);

        expect(wasRedirectedToWizard(wrapper)).toEqual(true);
        expect(store.getState().sources.undoValues).toEqual(values);
        expect(store.getState().notifications).toHaveLength(0);
    });

    it('should pass when no message', () => {
        const wrapper = mount(componentWrapperIntl(<UndoButtonAdd {...initialProps} />, store, [routes.sources.path]));

        clickOnButton(wrapper);

        expect(store.getState().notifications).toHaveLength(0);
    });

    it('should set refresh the page when on wizard', () => {
        refresh.refreshPage = jest.fn();

        const wrapper = mount(componentWrapperIntl(<UndoButtonAdd {...initialProps} />, store, [routes.sourcesNew.path]));

        clickOnButton(wrapper);

        expect(refresh.refreshPage).toHaveBeenCalled();
    });
});
