import React from 'react';
import { mount } from 'enzyme';
import { Route, MemoryRouter } from 'react-router-dom';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { act } from 'react-dom/test-utils';
import { Spinner } from '@redhat-cloud-services/frontend-components';

import { componentWrapperIntl } from '../../../Utilities/testsHelpers';
import SourceEditModal from '../../../components/SourceEditForm/SourceEditModal';
import { routes, replaceRouteId } from '../../../Routes';
import { applicationTypesData } from '../../applicationTypesData';
import { sourceTypesData, OPENSHIFT_ID } from '../../sourceTypesData';
import { sourcesDataGraphQl } from '../../sourcesData';
import { Modal, Button, FormGroup, TextInput, Form } from '@patternfly/react-core';
import * as editApi from '../../../api/doLoadSourceForEdit';
import EditFieldProvider from '../../../components/editField/EditField';
import * as submit from '../../../components/SourceEditForm/onSubmit';
import * as redirect from '../../../components/SourceEditForm/importedRedirect';

jest.mock('@redhat-cloud-services/frontend-components-sources', () => ({
    asyncValidator: jest.fn()
}));

describe('SourceEditModal', () => {
    let store;
    let initialEntry;
    let mockStore;
    let wrapper;

    const middlewares = [thunk, notificationsMiddleware()];

    const BUTTONS = ['closeIcon', 'submit', 'reset', 'cancel'];

    const CANCEL_POS = BUTTONS.indexOf('cancel');
    const RESET_POS = BUTTONS.indexOf('reset');
    const ONCLOSE_POS = BUTTONS.indexOf('closeIcon');

    const getCurrentAddress = wrapper => wrapper.find(MemoryRouter).instance().history.location.pathname;

    beforeEach(async () => {
        initialEntry = [replaceRouteId(routes.sourcesEdit.path, '14')];
        mockStore = configureStore(middlewares);
        store = mockStore({
            sources: {
                entities: sourcesDataGraphQl,
                appTypes: applicationTypesData.data,
                sourceTypes: sourceTypesData.data,
                appTypesLoaded: true,
                sourceTypesLoaded: true
            }
        });

        editApi.doLoadSourceForEdit = jest.fn().mockImplementation(() => Promise.resolve({
            source: {
                name: 'Name',
                source_type_id: OPENSHIFT_ID
            },
            applications: [],
            endpoints: [],
            authentications: []
        }));

        await act(async() => {
            wrapper = mount(componentWrapperIntl(
                <Route path={routes.sourcesEdit.path} render={ (...args) => <SourceEditModal { ...args }/> } />,
                store,
                initialEntry
            ));
        });
        wrapper.update();
    });

    it('renders correctly', () => {
        expect(wrapper.find(Modal)).toHaveLength(1);
        expect(wrapper.find(EditFieldProvider).length).toBeGreaterThan(0);
        expect(wrapper.find(Button)).toHaveLength(BUTTONS.length);
    });

    it('calls redirectWhenImported when imported source', async() => {
        const DISPATCH = expect.any(Function);
        const INTL = expect.any(Object);
        const HISTORY = expect.any(Object);
        const SOURCE_NAME = 'some name';

        redirect.redirectWhenImported = jest.fn();

        editApi.doLoadSourceForEdit = jest.fn().mockImplementation(() => Promise.resolve({
            source: {
                name: SOURCE_NAME,
                source_type_id: OPENSHIFT_ID,
                imported: 'cfme'
            },
            applications: [],
            endpoints: [],
            authentications: []
        }));

        await act(async() => {
            wrapper = mount(componentWrapperIntl(
                <Route path={routes.sourcesEdit.path} render={ (...args) => <SourceEditModal { ...args }/> } />,
                store,
                initialEntry
            ));
        });
        wrapper.update();

        expect(redirect.redirectWhenImported).toHaveBeenCalledWith(
            DISPATCH,
            INTL,
            HISTORY,
            SOURCE_NAME
        );
    });

    it('change editField component for name', async() => {
        expect(wrapper.find(TextInput)).toHaveLength(0);

        const UNEDITED_FIELDS = wrapper.find(EditFieldProvider).length;

        const nameFormGroup = wrapper.find(FormGroup).first();
        await act(async() => {
            nameFormGroup.simulate('click');
        });
        wrapper.update();

        const UNEDITED_FIELDS_WITHOUT_NAME_FIELD = UNEDITED_FIELDS - 1;

        expect(wrapper.find(EditFieldProvider).length).toEqual(UNEDITED_FIELDS_WITHOUT_NAME_FIELD);
        expect(wrapper.find(TextInput)).toHaveLength(1);

    });

    it('calls onSubmit with values and editing object', async() => {
        const NEW_NAME_VALUE = 'new name';

        const VALUES = expect.objectContaining({
            source: expect.objectContaining({
                name: NEW_NAME_VALUE
            })
        });
        const EDITING = {
            'source.name': true
        };
        const DISPATCH = expect.any(Function);
        const PUSH = expect.any(Function);
        const SOURCE = expect.any(Object);
        const INTL = expect.objectContaining({
            formatMessage: expect.any(Function)
        });

        submit.onSubmit = jest.fn();

        const nameFormGroup = wrapper.find(FormGroup).first();
        await act(async() => {
            nameFormGroup.simulate('click');
        });
        wrapper.update();

        await act(async() => {
            wrapper.find('input').instance().value = NEW_NAME_VALUE;
            wrapper.find('input').simulate('change');
        });
        wrapper.update();

        const form = wrapper.find(Form);

        await act(async() => {
            form.simulate('submit');
        });

        expect(submit.onSubmit).toHaveBeenCalledWith(
            VALUES,
            EDITING,
            DISPATCH,
            SOURCE,
            INTL,
            PUSH
        );
    });

    it('calls onCancel via onClose icon and returns to root', async () => {
        const closeButton = wrapper.find(Button).at(ONCLOSE_POS);

        await act(async() => {
            closeButton.simulate('click');
        });
        wrapper.update();

        expect(getCurrentAddress(wrapper)).toEqual(routes.sources.path);
    });

    it('calls onCancel via cancel button and returns to root', async () => {
        const cancelButton = wrapper.find(Button).at(CANCEL_POS);

        await act(async() => {
            cancelButton.simulate('click');
        });
        wrapper.update();

        expect(getCurrentAddress(wrapper)).toEqual(routes.sources.path);
    });

    it('calls onRetry and resets edited fields', async () => {
        const UNEDITED_FIELDS = wrapper.find(EditFieldProvider).length;

        const nameFormGroup = wrapper.find(FormGroup).first();
        await act(async() => {
            nameFormGroup.simulate('click');
        });
        wrapper.update();

        expect(wrapper.find(EditFieldProvider)).toHaveLength(UNEDITED_FIELDS - 1);

        await act(async() => {
            wrapper.find('input').instance().value = 'new value';
            wrapper.find('input').simulate('change');
        });
        wrapper.update();

        const resetButton = wrapper.find(Button).at(RESET_POS);

        await act(async() => {
            resetButton.simulate('click');
        });
        wrapper.update();

        expect(wrapper.find(EditFieldProvider)).toHaveLength(UNEDITED_FIELDS);
    });

    it('renders loading modal', async() => {
        store = mockStore({
            sources: {
                entities: sourcesDataGraphQl,
                appTypes: applicationTypesData.data,
                sourceTypes: sourceTypesData.data,
                appTypesLoaded: false,
                sourceTypesLoaded: false
            }
        });

        await act(async() => {
            wrapper = mount(componentWrapperIntl(
                <Route path={routes.sourcesEdit.path} render={ (...args) => <SourceEditModal { ...args }/> } />,
                store,
                initialEntry
            ));
        });
        wrapper.update();

        expect(wrapper.find(Modal)).toHaveLength(1);
        expect(wrapper.find(Spinner)).toHaveLength(1);
    });

    it('calls onClose from loading screen', async() => {
        store = mockStore({
            sources: {
                entities: sourcesDataGraphQl,
                appTypes: applicationTypesData.data,
                sourceTypes: sourceTypesData.data,
                appTypesLoaded: false,
                sourceTypesLoaded: false
            }
        });

        await act(async() => {
            wrapper = mount(componentWrapperIntl(
                <Route path={routes.sourcesEdit.path} render={ (...args) => <SourceEditModal { ...args }/> } />,
                store,
                initialEntry
            ));
        });
        wrapper.update();

        const closeButton = wrapper.find(Button).at(ONCLOSE_POS);

        await act(async() => {
            closeButton.simulate('click');
        });
        wrapper.update();

        expect(getCurrentAddress(wrapper)).toEqual(routes.sources.path);
    });
});
