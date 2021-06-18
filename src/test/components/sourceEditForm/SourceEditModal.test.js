import React from 'react';
import { mount } from 'enzyme';
import { Route } from 'react-router-dom';
import { act } from 'react-dom/test-utils';

import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import SourceEditModal from '../../../components/SourceEditForm/SourceEditModal';
import { routes, replaceRouteId } from '../../../Routes';
import { applicationTypesData, CATALOG_APP, TOPOLOGICALINVENTORY_APP } from '../../__mocks__/applicationTypesData';
import { sourceTypesData, ANSIBLE_TOWER_ID } from '../../__mocks__/sourceTypesData';
import { sourcesDataGraphQl } from '../../__mocks__/sourcesData';

import { Spinner, EmptyState, TextInput, Alert, Form } from '@patternfly/react-core';
import PauseIcon from '@patternfly/react-icons/dist/esm/icons/pause-icon';

import * as editApi from '../../../api/doLoadSourceForEdit';
import * as submit from '../../../components/SourceEditForm/onSubmit';
import reducer from '../../../components/SourceEditForm/reducer';

import SubmittingModal from '../../../components/SourceEditForm/SubmittingModal';
import EditAlert from '../../../components/SourceEditForm/parser/EditAlert';
import ErroredModal from '../../../components/SourceEditForm/ErroredModal';
import SourcesFormRenderer from '../../../utilities/SourcesFormRenderer';
import Switch from '@data-driven-forms/pf4-component-mapper/switch';
import { ACTION_TYPES } from '../../../redux/sources/actionTypes';
import { useDispatch } from 'react-redux';
import { UNAVAILABLE } from '../../../views/formatters';
import mockStore from '../../__mocks__/mockStore';
import { getStore } from '../../../utilities/store';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';

describe('SourceEditModal', () => {
  let store;
  let initialEntry;
  let wrapper;

  const BUTTONS = ['submit', 'reset'];

  beforeEach(async () => {
    initialEntry = [replaceRouteId(routes.sourcesDetail.path, '14')];
    store = mockStore({
      sources: {
        entities: [
          {
            id: '14',
            source_type_id: ANSIBLE_TOWER_ID,
            applications: [
              {
                id: '123',
                authentications: [{ id: '343' }],
              },
            ],
          },
        ],
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
          source_type_id: ANSIBLE_TOWER_ID,
          applications: [
            {
              id: '123',
              application_type_id: CATALOG_APP.id,
              authentications: [{ id: '343' }],
            },
          ],
          endpoints: [{ id: '10953' }],
        },
        applications: [
          {
            application_type_id: CATALOG_APP.id,
            id: '123',
            authentications: [{ type: 'username_password', username: '123', id: '343', resource_type: 'Endpoint' }],
          },
        ],
        endpoints: [
          {
            certificate_authority: 'sadas',
            default: true,
            host: 'myopenshiftcluster.mycompany.com',
            id: '10953',
            path: '/',
            role: 'ansible',
            scheme: 'https',
            verify_ssl: true,
          },
        ],
        authentications: [],
      })
    );

    await act(async () => {
      wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesDetail.path} render={(...args) => <SourceEditModal {...args} />} />,
          store,
          initialEntry
        )
      );
    });
    wrapper.update();
  });

  it('renders correctly', () => {
    expect(wrapper.find(SourcesFormRenderer)).toHaveLength(1);
    expect(wrapper.find(TextInput)).toHaveLength(4);

    expect(wrapper.find(TextInput).at(0).props().name).toEqual('endpoint.role');
    expect(wrapper.find(TextInput).at(1).props().name).toEqual('url');
    expect(wrapper.find(TextInput).at(2).props().name).toEqual('endpoint.certificate_authority');
    expect(wrapper.find(TextInput).at(3).props().name).toEqual('endpoint.receptor_node');

    expect(wrapper.find(Switch)).toHaveLength(2);
    expect(wrapper.find('button.pf-c-button')).toHaveLength(BUTTONS.length);
  });

  it('renders correctly with initial message', async () => {
    editApi.doLoadSourceForEdit = jest.fn().mockImplementation(() =>
      Promise.resolve({
        source: {
          name: 'Name',
          source_type_id: ANSIBLE_TOWER_ID,
          applications: [
            {
              id: '123',
              application_type_id: CATALOG_APP.id,
              availability_status_error: 'app-error',
              availability_status: UNAVAILABLE,
              authentications: [{ id: '343' }],
            },
          ],
          endpoints: [{ id: '10953' }],
        },
        applications: [
          {
            application_type_id: CATALOG_APP.id,
            id: '123',
            availability_status_error: 'app-error',
            availability_status: UNAVAILABLE,
            authentications: [{ type: 'username_password', username: '123', id: '343', resource_type: 'Endpoint' }],
          },
        ],
        endpoints: [
          {
            certificate_authority: 'sadas',
            default: true,
            host: 'myopenshiftcluster.mycompany.com',
            id: '10953',
            path: '/',
            role: 'ansible',
            scheme: 'https',
            verify_ssl: true,
          },
        ],
        authentications: [],
      })
    );

    await act(async () => {
      wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesDetail.path} render={(...args) => <SourceEditModal {...args} />} />,
          store,
          initialEntry
        )
      );
    });
    wrapper.update();

    expect(wrapper.find(EditAlert)).toHaveLength(1);

    expect(wrapper.find(EditAlert).find(Alert).props().title).toEqual('This application is unavailable');
    expect(wrapper.find(EditAlert).find(Alert).props().variant).toEqual('danger');
    expect(wrapper.find(EditAlert).find(Alert).props().children).toEqual('app-error');

    await act(async () => {
      wrapper.find(TextInput).at(2).find('input').instance().value = 'different-value';
      wrapper.find(TextInput).at(2).simulate('change');
    });
    wrapper.update();

    submit.onSubmit = jest.fn().mockImplementation((values, editing, _dispatch, source, _intl, setState) => {
      setState({
        type: 'submitFinished',
        messages: {
          123: {
            variant: 'success',
            title: 'success title',
          },
        },
      });
      setState({ type: 'sourceChanged' });
    });

    const form = wrapper.find(Form);

    expect(wrapper.find(SubmittingModal)).toHaveLength(0);

    await act(async () => {
      form.simulate('submit');
    });
    wrapper.update();

    expect(wrapper.find(EditAlert)).toHaveLength(1);

    expect(wrapper.find(EditAlert).find(Alert).props().title).toEqual('success title');
    expect(wrapper.find(EditAlert).find(Alert).props().variant).toEqual('success');
    expect(wrapper.find(EditAlert).find(Alert).props().children).toEqual(undefined);
  });

  it('do not show initial messages when in paused source', async () => {
    store = mockStore({
      sources: {
        entities: [
          {
            id: '14',
            source_type_id: ANSIBLE_TOWER_ID,
            paused_at: 'today',
            applications: [
              {
                id: '123',
                authentications: [{ id: '343' }],
              },
            ],
          },
        ],
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
          paused_at: 'today',
          source_type_id: ANSIBLE_TOWER_ID,
          applications: [
            {
              id: '123',
              application_type_id: CATALOG_APP.id,
              availability_status_error: 'app-error',
              availability_status: UNAVAILABLE,
              authentications: [{ id: '343' }],
            },
          ],
          endpoints: [{ id: '10953' }],
        },
        applications: [
          {
            application_type_id: CATALOG_APP.id,
            id: '123',
            availability_status_error: 'app-error',
            availability_status: UNAVAILABLE,
            authentications: [{ type: 'username_password', username: '123', id: '343' }],
          },
        ],
        endpoints: [
          {
            certificate_authority: 'sadas',
            default: true,
            host: 'myopenshiftcluster.mycompany.com',
            id: '10953',
            path: '/',
            role: 'ansible',
            scheme: 'https',
            verify_ssl: true,
          },
        ],
        authentications: [],
      })
    );

    await act(async () => {
      wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesDetail.path} render={(...args) => <SourceEditModal {...args} />} />,
          store,
          initialEntry
        )
      );
    });
    wrapper.update();

    expect(wrapper.find(EditAlert)).toHaveLength(0);
  });

  it('renders correctly with paused application', async () => {
    editApi.doLoadSourceForEdit = jest.fn().mockImplementation(() =>
      Promise.resolve({
        source: {
          name: 'Name',
          source_type_id: ANSIBLE_TOWER_ID,
          applications: [
            {
              id: '123',
              application_type_id: CATALOG_APP.id,
              availability_status_error: 'app-error',
              availability_status: UNAVAILABLE,
              authentications: [{ id: '343' }],
              paused_at: 'today',
            },
          ],
          endpoints: [{ id: '10953' }],
        },
        applications: [
          {
            application_type_id: CATALOG_APP.id,
            id: '123',
            availability_status_error: 'app-error',
            availability_status: UNAVAILABLE,
            authentications: [{ type: 'username_password', username: '123', id: '343' }],
            paused_at: 'today',
          },
        ],
        endpoints: [
          {
            certificate_authority: 'sadas',
            default: true,
            host: 'myopenshiftcluster.mycompany.com',
            id: '10953',
            path: '/',
            role: 'ansible',
            scheme: 'https',
            verify_ssl: true,
          },
        ],
        authentications: [],
      })
    );

    await act(async () => {
      wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesDetail.path} render={(...args) => <SourceEditModal {...args} />} />,
          store,
          initialEntry
        )
      );
    });
    wrapper.update();

    expect(wrapper.find(EditAlert)).toHaveLength(1);

    expect(wrapper.find(EditAlert).find(Alert).props().title).toEqual('Catalog is paused');
    expect(wrapper.find(EditAlert).find(Alert).props().variant).toEqual('default');
    expect(wrapper.find(EditAlert).find(Alert).text()).toEqual(
      'Default alert:Catalog is pausedTo resume data collection for this application, switch Catalog on in the Applications section of this page.'
    );
    expect(wrapper.find(EditAlert).find(Alert).find(PauseIcon)).toHaveLength(1);
    expect(wrapper.find(FormTemplate).props().showFormControls).toEqual(false);
  });

  it('renders correctly with paused applications', async () => {
    editApi.doLoadSourceForEdit = jest.fn().mockImplementation(() =>
      Promise.resolve({
        source: {
          name: 'Name',
          source_type_id: ANSIBLE_TOWER_ID,
          applications: [
            {
              id: '123',
              application_type_id: CATALOG_APP.id,
              authentications: [{ id: '343' }],
              paused_at: 'today',
            },
            {
              id: '124',
              application_type_id: TOPOLOGICALINVENTORY_APP.id,
              authentications: [{ id: '3434' }],
              paused_at: 'today',
            },
          ],
          endpoints: [],
        },
        applications: [
          {
            application_type_id: CATALOG_APP.id,
            id: '123',
            authentications: [{ type: 'username_password', username: '123', id: '343' }],
            paused_at: 'today',
          },
          {
            id: '124',
            application_type_id: TOPOLOGICALINVENTORY_APP.id,
            authentications: [{ id: '3434', type: 'arn' }],
            paused_at: 'today',
          },
        ],
        endpoints: [],
        authentications: [],
      })
    );

    await act(async () => {
      wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesDetail.path} render={(...args) => <SourceEditModal {...args} />} />,
          store,
          initialEntry
        )
      );
    });
    wrapper.update();

    expect(wrapper.find(FormTemplate).props().showFormControls).toEqual(false);
  });

  it('renders correctly with paused application and unpaused application', async () => {
    editApi.doLoadSourceForEdit = jest.fn().mockImplementation(() =>
      Promise.resolve({
        source: {
          name: 'Name',
          source_type_id: ANSIBLE_TOWER_ID,
          applications: [
            {
              id: '123',
              application_type_id: CATALOG_APP.id,
              authentications: [{ id: '343' }],
              paused_at: 'today',
            },
            {
              id: '124',
              application_type_id: TOPOLOGICALINVENTORY_APP.id,
              authentications: [{ id: '3434' }],
            },
          ],
          endpoints: [],
        },
        applications: [
          {
            application_type_id: CATALOG_APP.id,
            id: '123',
            authentications: [{ type: 'username_password', username: '123', id: '343' }],
            paused_at: 'today',
          },
          {
            id: '124',
            application_type_id: TOPOLOGICALINVENTORY_APP.id,
            authentications: [{ id: '3434', type: 'arn' }],
          },
        ],
        endpoints: [],
        authentications: [],
      })
    );

    await act(async () => {
      wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesDetail.path} render={(...args) => <SourceEditModal {...args} />} />,
          store,
          initialEntry
        )
      );
    });
    wrapper.update();

    expect(wrapper.find(FormTemplate).props().showFormControls).toEqual(true);
  });

  it('renders correctly with paused source', async () => {
    editApi.doLoadSourceForEdit = jest.fn().mockImplementation(() =>
      Promise.resolve({
        source: {
          name: 'Name',
          paused_at: 'today',
          source_type_id: ANSIBLE_TOWER_ID,
          applications: [
            {
              id: '123',
              application_type_id: CATALOG_APP.id,
              authentications: [{ id: '343' }],
            },
          ],
          endpoints: [],
        },
        applications: [
          {
            application_type_id: CATALOG_APP.id,
            id: '123',
            authentications: [{ type: 'username_password', username: '123', id: '343' }],
          },
        ],
        endpoints: [],
        authentications: [],
      })
    );

    await act(async () => {
      wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesDetail.path} render={(...args) => <SourceEditModal {...args} />} />,
          store,
          initialEntry
        )
      );
    });
    wrapper.update();

    expect(wrapper.find(FormTemplate).props().showFormControls).toEqual(false);
  });

  it('reload data when source from redux is changed', async () => {
    const ChangeSourceComponent = () => {
      const dispatch = useDispatch();

      return (
        <button
          id="change-redux-source"
          onClick={() =>
            dispatch({
              type: ACTION_TYPES.LOAD_ENTITIES_FULFILLED,
              payload: {
                sources: [
                  {
                    id: '14',
                    source_type_id: ANSIBLE_TOWER_ID,
                    applications: [],
                  },
                ],
                sources_aggregate: { aggregate: { total_count: 1 } },
              },
            })
          }
        />
      );
    };

    editApi.doLoadSourceForEdit.mockClear();

    store = getStore([], {
      sources: {
        entities: [
          {
            id: '14',
            source_type_id: ANSIBLE_TOWER_ID,
            applications: [
              {
                id: '123',
                authentications: [{ id: '343' }],
              },
            ],
          },
        ],
        appTypes: applicationTypesData.data,
        sourceTypes: sourceTypesData.data,
        appTypesLoaded: true,
        sourceTypesLoaded: true,
        loaded: 0,
      },
      user: { isOrgAdmin: true },
    });

    await act(async () => {
      wrapper = mount(
        componentWrapperIntl(
          <Route
            path={routes.sourcesDetail.path}
            render={(...args) => (
              <React.Fragment>
                <ChangeSourceComponent />
                <SourceEditModal {...args} />
              </React.Fragment>
            )}
          />,
          store,
          initialEntry
        )
      );
    });
    wrapper.update();

    expect(editApi.doLoadSourceForEdit.mock.calls).toHaveLength(1);

    await act(async () => {
      wrapper.find('#change-redux-source').simulate('click');
    });
    wrapper.update();

    expect(editApi.doLoadSourceForEdit.mock.calls).toHaveLength(2);
  });

  describe('submit', () => {
    const NEW_CA = 'new name';

    const VALUES = expect.objectContaining({
      endpoint: expect.objectContaining({
        certificate_authority: NEW_CA,
      }),
    });
    const EDITING = {
      'endpoint.certificate_authority': true,
    };
    const DISPATCH = expect.any(Function);
    const SET_STATE = expect.any(Function);
    const SOURCE = expect.any(Object);
    const INTL = expect.objectContaining({
      formatMessage: expect.any(Function),
    });

    beforeEach(async () => {
      await act(async () => {
        wrapper.find(TextInput).at(2).find('input').instance().value = NEW_CA;
        wrapper.find(TextInput).at(2).simulate('change');
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
      const messages = {
        123: message,
      };

      submit.onSubmit = jest.fn().mockImplementation((values, editing, _dispatch, source, _intl, setState) => {
        setState({ type: 'submit', values, editing });

        setTimeout(() => {
          setState({ type: 'submitFinished', source, messages });
          setState({ type: 'sourceChanged' });
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

      jest.useRealTimers();
    });

    it('calls onSubmit - timeout - return to edit', async () => {
      jest.useFakeTimers();

      const variant = 'warning';
      const title = 'some title';
      const description = 'description of timeout';

      submit.onSubmit = jest.fn().mockImplementation((values, editing, _dispatch, source, _intl, setState) => {
        setState({ type: 'submit', values, editing });

        setTimeout(() => {
          const messages = {
            123: { variant, title, description },
          };

          setState({ type: 'submitFinished', messages });
          setState({ type: 'sourceChanged' });
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

      expect(wrapper.find(EditAlert)).toHaveLength(1);
      expect(wrapper.find(Alert).props().variant).toEqual(variant);
      expect(wrapper.find(Alert).props().title).toEqual(title);
      expect(wrapper.find(Alert).text().includes(description)).toEqual(true);

      jest.useRealTimers();
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
        wrapper.find(ErroredModal).find(EmptyState).find('Button').simulate('click');
      });
      wrapper.update();

      expect(submit.onSubmit).toHaveBeenCalledWith(VALUES, EDITING, DISPATCH, SOURCE, INTL, SET_STATE);

      jest.useRealTimers();
    });
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
          <Route path={routes.sourcesDetail.path} render={(...args) => <SourceEditModal {...args} />} />,
          store,
          initialEntry
        )
      );
    });
    wrapper.update();

    expect(wrapper.find(Spinner)).toHaveLength(1);
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
