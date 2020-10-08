import React from 'react';
import { mount } from 'enzyme';
import { Route, MemoryRouter } from 'react-router-dom';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { act } from 'react-dom/test-utils';
import { Spinner } from '@patternfly/react-core/dist/js/components/Spinner';

import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import SourceEditModal from '../../../components/SourceEditForm/SourceEditModal';
import { routes, replaceRouteId } from '../../../Routes';
import { applicationTypesData } from '../../__mocks__/applicationTypesData';
import { sourceTypesData, OPENSHIFT_ID } from '../../__mocks__/sourceTypesData';
import { sourcesDataGraphQl } from '../../__mocks__/sourcesData';
import { Modal, Button, FormGroup, TextInput, Form, Alert, EmptyState } from '@patternfly/react-core';
import * as editApi from '../../../api/doLoadSourceForEdit';
import * as submit from '../../../components/SourceEditForm/onSubmit';
import * as redirect from '../../../components/SourceEditForm/importedRedirect';
import reducer from '../../../components/SourceEditForm/reducer';

import SubmittingModal from '../../../components/SourceEditForm/SubmittingModal';
import EditAlert from '../../../components/SourceEditForm/parser/EditAlert';
import TimeoutedModal from '../../../components/SourceEditForm/TimeoutedModal';
import ErroredModal from '../../../components/SourceEditForm/ErroredModal';

import RemoveAuth from '../../../components/SourceEditForm/parser/RemoveAuth';
import * as api from '../../../api/entities';
import RemoveAuthPlaceholder from '../../../components/SourceEditForm/parser/RemoveAuthPlaceholder';
import GridLayout from '../../../components/SourceEditForm/parser/GridLayout';

jest.mock('@redhat-cloud-services/frontend-components-sources/cjs/SourceAddSchema', () => ({
  __esModule: true,
  asyncValidatorDebounced: jest.fn(),
}));

describe('SourceEditModal', () => {
  let store;
  let initialEntry;
  let mockStore;
  let wrapper;

  const middlewares = [thunk, notificationsMiddleware()];

  const BUTTONS = ['closeIcon', 'submit', 'reset', 'cancel'];

  const CANCEL_POS = BUTTONS.indexOf('cancel');
  //const RESET_POS = BUTTONS.indexOf('reset');
  const ONCLOSE_POS = BUTTONS.indexOf('closeIcon');

  const getCurrentAddress = (wrapper) => wrapper.find(MemoryRouter).instance().history.location.pathname;

  beforeEach(async () => {
    initialEntry = [replaceRouteId(routes.sourcesEdit.path, '14')];
    mockStore = configureStore(middlewares);
    store = mockStore({
      sources: {
        entities: sourcesDataGraphQl,
        appTypes: applicationTypesData.data,
        sourceTypes: sourceTypesData.data,
        appTypesLoaded: true,
        sourceTypesLoaded: true,
      },
    });

    editApi.doLoadSourceForEdit = jest.fn().mockImplementation(() =>
      Promise.resolve({
        source: {
          name: 'Name',
          source_type_id: OPENSHIFT_ID,
        },
        applications: [],
        endpoints: [],
        authentications: [],
      })
    );

    await act(async () => {
      wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesEdit.path} render={(...args) => <SourceEditModal {...args} />} />,
          store,
          initialEntry
        )
      );
    });
    wrapper.update();
  });

  it('renders correctly', () => {
    expect(wrapper.find(Modal)).toHaveLength(1);
    expect(wrapper.find(TextInput).length).toBeGreaterThan(0);
    expect(wrapper.find(Button)).toHaveLength(BUTTONS.length);
  });

  it('calls redirectWhenImported when imported source', async () => {
    const DISPATCH = expect.any(Function);
    const INTL = expect.any(Object);
    const HISTORY = expect.any(Object);
    const SOURCE_NAME = 'some name';

    redirect.redirectWhenImported = jest.fn();

    editApi.doLoadSourceForEdit = jest.fn().mockImplementation(() =>
      Promise.resolve({
        source: {
          name: SOURCE_NAME,
          source_type_id: OPENSHIFT_ID,
          imported: 'cfme',
        },
        applications: [],
        endpoints: [],
        authentications: [],
      })
    );

    await act(async () => {
      wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesEdit.path} render={(...args) => <SourceEditModal {...args} />} />,
          store,
          initialEntry
        )
      );
    });
    wrapper.update();

    expect(redirect.redirectWhenImported).toHaveBeenCalledWith(DISPATCH, INTL, HISTORY, SOURCE_NAME);
  });

  describe('submit', () => {
    const NEW_NAME_VALUE = 'new name';

    const VALUES = expect.objectContaining({
      source: expect.objectContaining({
        name: NEW_NAME_VALUE,
      }),
    });
    const EDITING = {
      'source.name': true,
    };
    const DISPATCH = expect.any(Function);
    const SET_STATE = expect.any(Function);
    const SOURCE = expect.any(Object);
    const INTL = expect.objectContaining({
      formatMessage: expect.any(Function),
    });

    beforeEach(async () => {
      const nameFormGroup = wrapper.find(FormGroup).first();
      await act(async () => {
        nameFormGroup.simulate('click');
      });
      wrapper.update();

      await act(async () => {
        wrapper.find('input').instance().value = NEW_NAME_VALUE;
        wrapper.find('input').simulate('change');
      });
      wrapper.update();
    });

    it('calls onSubmit with values and editing object', async () => {
      jest.useFakeTimers();

      const message = {
        title: 'some title',
        variant: 'danger',
        description: 'some description',
      };

      submit.onSubmit = jest.fn().mockImplementation((values, editing, _dispatch, source, _intl, setState) => {
        setState({ type: 'submit', values, editing });

        setTimeout(() => {
          setState({ type: 'submitFinished', source, message });
        }, 1000);
      });

      const form = wrapper.find(Form);

      expect(wrapper.find(SubmittingModal)).toHaveLength(0);

      await act(async () => {
        form.simulate('submit');
      });
      wrapper.update();

      expect(wrapper.find(SubmittingModal)).toHaveLength(1);

      await act(async () => {
        jest.runAllTimers();
      });
      wrapper.update();

      expect(wrapper.find(SubmittingModal)).toHaveLength(0);
      expect(wrapper.find(EditAlert)).toHaveLength(1);

      expect(wrapper.find(EditAlert).find(Alert).props().title).toEqual(message.title);
      expect(wrapper.find(EditAlert).find(Alert).props().variant).toEqual(message.variant);
      expect(wrapper.find(EditAlert).find(Alert).props().children).toEqual(message.description);

      expect(submit.onSubmit).toHaveBeenCalledWith(VALUES, EDITING, DISPATCH, SOURCE, INTL, SET_STATE);
    });

    it('calls onSubmit - timeout', async () => {
      jest.useFakeTimers();

      submit.onSubmit = jest.fn().mockImplementation((values, editing, _dispatch, source, _intl, setState) => {
        setState({ type: 'submit', values, editing });

        setTimeout(() => {
          setState({ type: 'submitTimetouted' });
        }, 1000);
      });

      const form = wrapper.find(Form);

      expect(wrapper.find(SubmittingModal)).toHaveLength(0);

      await act(async () => {
        form.simulate('submit');
      });
      wrapper.update();

      expect(wrapper.find(SubmittingModal)).toHaveLength(1);

      await act(async () => {
        jest.runAllTimers();
      });
      wrapper.update();

      expect(wrapper.find(TimeoutedModal)).toHaveLength(1);

      expect(submit.onSubmit).toHaveBeenCalledWith(VALUES, EDITING, DISPATCH, SOURCE, INTL, SET_STATE);
    });

    it('calls onSubmit - server error', async () => {
      jest.useFakeTimers();

      submit.onSubmit = jest.fn().mockImplementation((values, editing, _dispatch, source, _intl, setState) => {
        setState({ type: 'submit', values, editing });

        setTimeout(() => {
          setState({ type: 'submitFailed' });
        }, 1000);
      });

      const form = wrapper.find(Form);

      expect(wrapper.find(SubmittingModal)).toHaveLength(0);

      await act(async () => {
        form.simulate('submit');
      });
      wrapper.update();

      expect(wrapper.find(SubmittingModal)).toHaveLength(1);

      await act(async () => {
        jest.runAllTimers();
      });
      wrapper.update();

      expect(wrapper.find(ErroredModal)).toHaveLength(1);

      expect(submit.onSubmit).toHaveBeenCalledWith(VALUES, EDITING, DISPATCH, SOURCE, INTL, SET_STATE);

      submit.onSubmit.mockReset();

      // try again via retry button
      await act(async () => {
        wrapper.find(ErroredModal).find(EmptyState).find(Button).simulate('click');
      });
      wrapper.update();

      expect(submit.onSubmit).toHaveBeenCalledWith(VALUES, EDITING, DISPATCH, SOURCE, INTL, SET_STATE);
    });
  });

  it('calls onCancel via onClose icon and returns to root', async () => {
    const closeButton = wrapper.find(Button).at(ONCLOSE_POS);

    await act(async () => {
      closeButton.simulate('click');
    });
    wrapper.update();

    expect(getCurrentAddress(wrapper)).toEqual(routes.sources.path);
  });

  it('calls onCancel via cancel button and returns to root', async () => {
    const cancelButton = wrapper.find(Button).at(CANCEL_POS);

    await act(async () => {
      cancelButton.simulate('click');
    });
    wrapper.update();

    expect(getCurrentAddress(wrapper)).toEqual(routes.sources.path);
  });

  it('renders loading modal', async () => {
    store = mockStore({
      sources: {
        entities: sourcesDataGraphQl,
        appTypes: applicationTypesData.data,
        sourceTypes: sourceTypesData.data,
        appTypesLoaded: false,
        sourceTypesLoaded: false,
      },
    });

    await act(async () => {
      wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesEdit.path} render={(...args) => <SourceEditModal {...args} />} />,
          store,
          initialEntry
        )
      );
    });
    wrapper.update();

    expect(wrapper.find(Modal)).toHaveLength(1);
    expect(wrapper.find(Spinner)).toHaveLength(1);
  });

  it('calls onClose from loading screen', async () => {
    store = mockStore({
      sources: {
        entities: sourcesDataGraphQl,
        appTypes: applicationTypesData.data,
        sourceTypes: sourceTypesData.data,
        appTypesLoaded: false,
        sourceTypesLoaded: false,
      },
    });

    await act(async () => {
      wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesEdit.path} render={(...args) => <SourceEditModal {...args} />} />,
          store,
          initialEntry
        )
      );
    });
    wrapper.update();

    const closeButton = wrapper.find(Button).at(ONCLOSE_POS);

    await act(async () => {
      closeButton.simulate('click');
    });
    wrapper.update();

    expect(getCurrentAddress(wrapper)).toEqual(routes.sources.path);
  });

  describe('remove auth integration', () => {
    beforeEach(() => {
      editApi.doLoadSourceForEdit = jest.fn().mockImplementation(() =>
        Promise.resolve({
          source: {
            name: 'Name',
            source_type_id: OPENSHIFT_ID,
            applications: [],
          },
          applications: [],
          endpoints: [],
          authentications: [
            {
              id: 'authid',
              authtype: 'token',
            },
          ],
        })
      );

      initialEntry = [replaceRouteId(routes.sourcesEdit.path, '406')];
    });

    it('removes authentication successfully and shows loading during that', async () => {
      await act(async () => {
        wrapper = mount(
          componentWrapperIntl(
            <Route path={routes.sourcesEdit.path} render={(...args) => <SourceEditModal {...args} />} />,
            store,
            initialEntry
          )
        );
      });
      wrapper.update();

      expect(wrapper.find(GridLayout)).toHaveLength(1);
      expect(wrapper.find(RemoveAuthPlaceholder)).toHaveLength(0);
      expect(wrapper.find(Modal)).toHaveLength(1);

      await act(async () => {
        const removeButton = wrapper.find(Button).at(1);
        removeButton.simulate('click');
      });
      wrapper.update();

      api.doDeleteAuthentication = jest.fn().mockImplementation(() => new Promise((res) => setTimeout(() => res('OK'), 1)));

      expect(api.doDeleteAuthentication).not.toHaveBeenCalled();
      expect(wrapper.find(Modal)).toHaveLength(2);
      expect(wrapper.find(Modal).first().props().isOpen).toEqual(true);
      expect(wrapper.find(Modal).last().props().isOpen).toEqual(false);

      jest.useFakeTimers();
      await act(async () => {
        const removeConfirmButton = wrapper.find(RemoveAuth).find(Button).at(1);
        removeConfirmButton.simulate('click');
      });
      wrapper.update();
      expect(api.doDeleteAuthentication).toHaveBeenCalledWith('authid');
      expect(wrapper.find(RemoveAuthPlaceholder)).toHaveLength(1);
      expect(wrapper.find(Modal)).toHaveLength(1);
      expect(wrapper.find(Modal).props().isOpen).toEqual(true);

      await act(async () => {
        jest.advanceTimersByTime(1000);
      });
      wrapper.update();

      expect(wrapper.find(RemoveAuthPlaceholder)).toHaveLength(0);
      expect(wrapper.find(GridLayout)).toHaveLength(0);
    });

    it('removes authentication unsuccessfully', async () => {
      await act(async () => {
        wrapper = mount(
          componentWrapperIntl(
            <Route path={routes.sourcesEdit.path} render={(...args) => <SourceEditModal {...args} />} />,
            store,
            initialEntry
          )
        );
      });
      wrapper.update();

      expect(wrapper.find(GridLayout)).toHaveLength(1);

      await act(async () => {
        const removeButton = wrapper.find(Button).at(1);
        removeButton.simulate('click');
      });
      wrapper.update();

      api.doDeleteAuthentication = jest.fn().mockImplementation(() => Promise.reject('Error'));

      expect(api.doDeleteAuthentication).not.toHaveBeenCalled();

      await act(async () => {
        const removeConfirmButton = wrapper.find(RemoveAuth).find(Button).at(1);
        removeConfirmButton.simulate('click');
      });
      wrapper.update();

      expect(api.doDeleteAuthentication).toHaveBeenCalledWith('authid');
      expect(wrapper.find(GridLayout)).toHaveLength(1);
    });
  });

  describe('reducer', () => {
    it('returns default', () => {
      const state = {
        bla: 'blah',
      };
      expect(reducer(state, {})).toEqual(state);
    });
  });
});
