import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Route } from 'react-router-dom';

import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import SourceEditModal from '../../../components/SourceEditForm/SourceEditModal';
import { replaceRouteId, routes } from '../../../Routes';
import appTypes, { CATALOG_APP, TOPOLOGY_INV_APP } from '../../__mocks__/applicationTypes';
import sourceTypes, { ANSIBLE_TOWER_TYPE } from '../../__mocks__/sourceTypes';

import * as editApi from '../../../api/doLoadSourceForEdit';
import * as submit from '../../../components/SourceEditForm/onSubmit';
import reducer from '../../../components/SourceEditForm/reducer';

import { ACTION_TYPES } from '../../../redux/sources/actionTypes';
import { useDispatch } from 'react-redux';
import { UNAVAILABLE } from '../../../views/formatters';
import mockStore from '../../__mocks__/mockStore';
import { getStore } from '../../../utilities/store';

describe('SourceEditModal', () => {
  let store;
  let initialEntry;

  beforeEach(async () => {
    initialEntry = [replaceRouteId(routes.sourcesDetail.path, '14')];
    store = mockStore({
      sources: {
        entities: [
          {
            id: '14',
            source_type_id: ANSIBLE_TOWER_TYPE.id,
            applications: [
              {
                id: '123',
                authentications: [{ id: '343' }],
              },
            ],
          },
        ],
        appTypes,
        sourceTypes,
        appTypesLoaded: true,
        sourceTypesLoaded: true,
        hcsEnrolledLoaded: true,
      },
    });

    editApi.doLoadSourceForEdit = jest.fn().mockImplementation(() =>
      Promise.resolve({
        source: {
          name: 'Name',
          source_type_id: ANSIBLE_TOWER_TYPE.id,
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
  });

  it('renders correctly', async () => {
    render(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <SourceEditModal {...args} />} />,
        store,
        initialEntry
      )
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());

    expect([...screen.getAllByRole('textbox')].map((e) => e.name)).toEqual([
      'url',
      'endpoint.certificate_authority',
      'endpoint.receptor_node',
    ]);
    expect([...screen.getAllByRole('button')].map((e) => e.textContent)).toEqual(['Save changes', 'Reset']);
    expect(screen.getAllByRole('checkbox')).toHaveLength(2);
    expect(screen.getByRole('tab')).toHaveTextContent('Catalog');
  });

  it('renders correctly with initial message', async () => {
    const user = userEvent.setup();

    editApi.doLoadSourceForEdit = jest.fn().mockImplementation(() =>
      Promise.resolve({
        source: {
          name: 'Name',
          source_type_id: ANSIBLE_TOWER_TYPE.id,
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

    render(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <SourceEditModal {...args} />} />,
        store,
        initialEntry
      )
    );

    await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());

    expect(screen.getByText('This application is unavailable')).toBeInTheDocument();

    await user.clear(screen.getAllByRole('textbox')[1]);
    await user.type(screen.getAllByRole('textbox')[1], 'different-value');

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

    await user.click(screen.getByText('Save changes'));

    await waitFor(() => expect(screen.getByText('success title')).toBeInTheDocument());
  });

  it('do not show initial messages when in paused source', async () => {
    store = mockStore({
      sources: {
        entities: [
          {
            id: '14',
            source_type_id: ANSIBLE_TOWER_TYPE.id,
            paused_at: 'today',
            applications: [
              {
                id: '123',
                authentications: [{ id: '343' }],
              },
            ],
          },
        ],
        appTypes,
        sourceTypes,
        appTypesLoaded: true,
        sourceTypesLoaded: true,
        hcsEnrolledLoaded: true,
      },
    });

    editApi.doLoadSourceForEdit = jest.fn().mockImplementation(() =>
      Promise.resolve({
        source: {
          name: 'Name',
          paused_at: 'today',
          source_type_id: ANSIBLE_TOWER_TYPE.id,
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

    render(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <SourceEditModal {...args} />} />,
        store,
        initialEntry
      )
    );

    await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());

    expect(() => screen.getByText('This application is unavailable')).toThrow();
  });

  it('renders correctly with paused application', async () => {
    editApi.doLoadSourceForEdit = jest.fn().mockImplementation(() =>
      Promise.resolve({
        source: {
          name: 'Name',
          source_type_id: ANSIBLE_TOWER_TYPE.id,
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

    render(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <SourceEditModal {...args} />} />,
        store,
        initialEntry
      )
    );

    await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());

    expect(screen.getByText('Catalog is paused')).toBeInTheDocument();
    expect(screen.getByText('To resume data collection for this application, switch', { exact: false })).toBeInTheDocument();
    expect(() => screen.getAllByRole('button')).toThrow();
  });

  it('renders correctly with paused applications', async () => {
    editApi.doLoadSourceForEdit = jest.fn().mockImplementation(() =>
      Promise.resolve({
        source: {
          name: 'Name',
          source_type_id: ANSIBLE_TOWER_TYPE.id,
          applications: [
            {
              id: '123',
              application_type_id: CATALOG_APP.id,
              authentications: [{ id: '343' }],
              paused_at: 'today',
            },
            {
              id: '124',
              application_type_id: TOPOLOGY_INV_APP.id,
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
            application_type_id: TOPOLOGY_INV_APP.id,
            authentications: [{ id: '3434', type: 'arn' }],
            paused_at: 'today',
          },
        ],
        endpoints: [],
        authentications: [],
      })
    );

    render(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <SourceEditModal {...args} />} />,
        store,
        initialEntry
      )
    );

    await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());

    expect(() => screen.getAllByRole('button')).toThrow();
  });

  it('renders correctly with paused application and unpaused application', async () => {
    editApi.doLoadSourceForEdit = jest.fn().mockImplementation(() =>
      Promise.resolve({
        source: {
          name: 'Name',
          source_type_id: ANSIBLE_TOWER_TYPE.id,
          applications: [
            {
              id: '123',
              application_type_id: CATALOG_APP.id,
              authentications: [{ id: '343' }],
              paused_at: 'today',
            },
            {
              id: '124',
              application_type_id: TOPOLOGY_INV_APP.id,
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
            application_type_id: TOPOLOGY_INV_APP.id,
            authentications: [{ id: '3434', type: 'arn' }],
          },
        ],
        endpoints: [],
        authentications: [],
      })
    );

    render(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <SourceEditModal {...args} />} />,
        store,
        initialEntry
      )
    );

    await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());

    expect(screen.getAllByRole('button')).toHaveLength(2);
    expect(screen.getAllByRole('tab')).toHaveLength(2);
  });

  it('renders correctly with paused source', async () => {
    editApi.doLoadSourceForEdit = jest.fn().mockImplementation(() =>
      Promise.resolve({
        source: {
          name: 'Name',
          paused_at: 'today',
          source_type_id: ANSIBLE_TOWER_TYPE.id,
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

    render(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <SourceEditModal {...args} />} />,
        store,
        initialEntry
      )
    );

    await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());

    expect(() => screen.getAllByRole('button')).toThrow();
  });

  it('reload data when source from redux is changed', async () => {
    const user = userEvent.setup();

    const ChangeSourceComponent = () => {
      const dispatch = useDispatch();

      return (
        <button
          onClick={() =>
            dispatch({
              type: ACTION_TYPES.LOAD_ENTITIES_FULFILLED,
              payload: {
                sources: [
                  {
                    id: '14',
                    source_type_id: ANSIBLE_TOWER_TYPE.id,
                    applications: [],
                  },
                ],
                meta: { count: 1 },
              },
            })
          }
        >
          Change redux source
        </button>
      );
    };

    editApi.doLoadSourceForEdit.mockClear();

    store = getStore([], {
      sources: {
        entities: [
          {
            id: '14',
            source_type_id: ANSIBLE_TOWER_TYPE.id,
            applications: [
              {
                id: '123',
                authentications: [{ id: '343' }],
              },
            ],
          },
        ],
        appTypes,
        sourceTypes,
        appTypesLoaded: true,
        sourceTypesLoaded: true,
        loaded: 0,
        hcsEnrolledLoaded: true,
      },
      user: { writePermissions: true },
    });

    render(
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

    await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());

    expect(editApi.doLoadSourceForEdit.mock.calls).toHaveLength(1);

    await user.click(screen.getByText('Change redux source'));

    await waitFor(() => expect(editApi.doLoadSourceForEdit.mock.calls).toHaveLength(2));
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
      const user = userEvent.setup();

      render(
        componentWrapperIntl(
          <Route path={routes.sourcesDetail.path} render={(...args) => <SourceEditModal {...args} />} />,
          store,
          initialEntry
        )
      );

      await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());

      await user.clear(screen.getAllByRole('textbox')[1]);
      await user.type(screen.getAllByRole('textbox')[1], NEW_CA);
    });

    it('calls onSubmit with values and editing object', async () => {
      const user = userEvent.setup();

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

      await user.click(screen.getByText('Save changes'));

      expect(screen.getByText('Validating edited source credentials')).toBeInTheDocument();

      await waitFor(() => expect(() => screen.getByText('Validating edited source credentials')).toThrow());

      expect(screen.getByText(message.title)).toBeInTheDocument();
      expect(screen.getByText(message.description)).toBeInTheDocument();
      expect(screen.getByText('Danger alert', { exact: false })).toBeInTheDocument();

      expect(submit.onSubmit).toHaveBeenCalledWith(VALUES, EDITING, DISPATCH, SOURCE, INTL, SET_STATE);
    });

    it('calls onSubmit - timeout - return to edit', async () => {
      const user = userEvent.setup();

      const variant = 'warning';
      const title = 'some title';
      const description = 'description of timeout';

      submit.onSubmit = jest.fn().mockImplementation((values, editing, _dispatch, source, _intl, setState) => {
        setState({ type: 'submit', values, editing });

        setTimeout(() => {
          const messages = {
            123: { variant, title, description },
          };

          setState({ type: 'submitFinished', source, messages });
          setState({ type: 'sourceChanged' });
        }, 1000);
      });

      await user.click(screen.getByText('Save changes'));

      expect(screen.getByText('Validating edited source credentials')).toBeInTheDocument();

      await waitFor(() => expect(() => screen.getByText('Validating edited source credentials')).toThrow());

      expect(screen.getByText(title)).toBeInTheDocument();
      expect(screen.getByText(description)).toBeInTheDocument();
      expect(screen.getByText('Warning alert', { exact: false })).toBeInTheDocument();
    });

    it('calls onSubmit - server error', async () => {
      const user = userEvent.setup();

      submit.onSubmit = jest.fn().mockImplementation((values, editing, _dispatch, source, _intl, setState) => {
        setState({ type: 'submit', values, editing });

        setTimeout(() => {
          setState({ type: 'submitFailed' });
        }, 1000);
      });

      await user.click(screen.getByText('Save changes'));

      expect(screen.getByText('Validating edited source credentials')).toBeInTheDocument();

      await waitFor(() => expect(() => screen.getByText('Validating edited source credentials')).toThrow());

      expect(
        screen.getByText(
          'There was a problem while trying to edit your source. Please try again. If the error persists, open a support case.'
        )
      ).toBeInTheDocument();

      expect(submit.onSubmit).toHaveBeenCalledWith(VALUES, EDITING, DISPATCH, SOURCE, INTL, SET_STATE);

      submit.onSubmit.mockReset();

      await user.click(screen.getByText('Retry'));

      await waitFor(() => expect(submit.onSubmit).toHaveBeenCalledWith(VALUES, EDITING, DISPATCH, SOURCE, INTL, SET_STATE));
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
