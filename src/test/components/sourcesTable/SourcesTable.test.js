import React from 'react';
import { sortable, wrappable } from '@patternfly/react-table';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SourcesTable, { actionResolver, itemToCells, prepareColumnsCells } from '../../../components/SourcesTable/SourcesTable';

import { sourcesDataGraphQl } from '../../__mocks__/sourcesData';
import sourceTypes from '../../__mocks__/sourceTypes';
import appTypes from '../../__mocks__/applicationTypes';

import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import * as actions from '../../../redux/sources/actions';
import * as API from '../../../api/entities';
import { replaceRouteId, routes } from '../../../Routing';
import { defaultSourcesState } from '../../../redux/sources/reducer';
import mockStore from '../../__mocks__/mockStore';
import { disabledMessage } from '../../../utilities/disabledTooltipProps';
import { act } from 'react-dom/test-utils';

describe('SourcesTable', () => {
  let loadedProps;
  let initialProps;
  let initialState;

  beforeEach(() => {
    initialProps = {};
    initialState = {
      sources: defaultSourcesState,
      user: {
        writePermissions: true,
      },
    };
    loadedProps = {
      loaded: 0,
      appTypesLoaded: true,
      sourceTypesLoaded: true,
      entities: sourcesDataGraphQl,
      numberOfEntities: sourcesDataGraphQl.length,
      appTypes,
      sourceTypes,
    };
    API.doLoadEntities = jest.fn().mockImplementation(() =>
      Promise.resolve({
        sources: sourcesDataGraphQl,
        meta: { count: sourcesDataGraphQl.length },
      })
    );
  });

  it('renders loading state', () => {
    const store = mockStore(initialState);
    render(componentWrapperIntl(<SourcesTable {...initialProps} />, store));

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(() => screen.getByRole('button')).toThrow();
  });

  it('renders removing row', async () => {
    initialState = {
      ...initialState,
      sources: {
        ...initialState.sources,
        ...loadedProps,
        removingSources: [sourcesDataGraphQl[0].id],
      },
    };

    const store = mockStore(initialState);

    render(componentWrapperIntl(<SourcesTable {...initialProps} />, store));

    expect(screen.getAllByTestId('row')).toHaveLength(sourcesDataGraphQl.length - 1);
    expect(screen.getAllByTestId('removing-row')).toHaveLength(1);
  });

  it('renders table when loaded', async () => {
    initialState = {
      ...initialState,
      sources: {
        ...initialState.sources,
        ...loadedProps,
      },
    };

    const store = mockStore(initialState);

    const { container } = render(componentWrapperIntl(<SourcesTable {...initialProps} />, store));

    expect(screen.getByText(sourcesDataGraphQl[0].name)).toBeInTheDocument();
    expect(screen.getAllByTestId('row')).toHaveLength(sourcesDataGraphQl.length);
    expect([...screen.getAllByRole('button')].map((e) => e.textContent).filter(Boolean)).toEqual([
      'Name',
      'Type',
      'Date added',
      '1 more',
    ]);
    expect([...container.getElementsByTagName('th')].map((e) => e.textContent)).toEqual([
      'Name',
      'Type',
      'Connected applications',
      'Date added',
      '',
      'Status',
    ]);
  });

  it('renders table when loaded and its not org admin - no action column', async () => {
    const user = userEvent.setup();

    const INTL = { formatMessage: ({ defaultMessage }) => defaultMessage };
    initialState = {
      user: {
        writePermissions: false,
      },
      sources: {
        ...initialState.sources,
        ...loadedProps,
      },
    };

    const store = mockStore(initialState);

    render(componentWrapperIntl(<SourcesTable {...initialProps} />, store));

    await act(async () => {
      await user.click(screen.getAllByLabelText('Kebab toggle')[0]);
    });

    await act(async () => {
      await user.click(screen.getByText('Edit'));
    });

    await waitFor(() => expect(screen.getByText(disabledMessage(INTL))).toBeInTheDocument());
  });

  it('renders empty state table', async () => {
    initialState = {
      ...initialState,
      sources: {
        ...initialState.sources,
        ...loadedProps,
        entities: [],
        numberOfEntities: 0,
        filterValue: {
          name: 'not-existing-name',
        },
      },
    };

    const store = mockStore(initialState);

    render(componentWrapperIntl(<SourcesTable {...initialProps} />, store));

    expect(screen.getByTestId('row')).toBeInTheDocument();
    expect(screen.getByText('No sources found')).toBeInTheDocument();
    expect(
      screen.getByText('No sources match the filter criteria. Remove all filters or clear all filters to show sources.')
    ).toBeInTheDocument();
    expect(screen.getByText('Clear all filters')).toBeInTheDocument();
  });

  it('re-renders when entities changed', async () => {
    initialState = {
      ...initialState,
      sources: {
        ...initialState.sources,
        ...loadedProps,
      },
    };

    const initialStateUpdated = {
      ...initialState,
      sources: {
        ...initialState.sources,
        entities: [sourcesDataGraphQl[0]],
        numberOfEntities: 1,
      },
    };

    let mockStoreFn = jest.fn().mockImplementation(() => initialState);
    const store = mockStore(mockStoreFn);

    const { rerender } = render(componentWrapperIntl(<SourcesTable {...initialProps} />, store));

    expect(screen.getAllByTestId('row')).toHaveLength(sourcesDataGraphQl.length);

    mockStoreFn.mockImplementation(() => initialStateUpdated);

    rerender(componentWrapperIntl(<SourcesTable {...initialProps} />, store));

    expect(screen.getAllByTestId('row')).toHaveLength(1);
  });

  describe('actions', () => {
    let store;

    beforeEach(async () => {
      initialState = {
        ...initialState,
        sources: {
          ...initialState.sources,
          ...loadedProps,
        },
      };

      store = mockStore(initialState);

      render(componentWrapperIntl(<SourcesTable {...initialProps} />, store));
    });

    it('redirect to edit', async () => {
      const user = userEvent.setup();

      await waitFor(async () => {
        await user.click(screen.getAllByLabelText('Kebab toggle')[0]);
      });
      await waitFor(async () => {
        await user.click(screen.getByText('Edit'));
      });
      const expectedPath = replaceRouteId(`/settings/integrations/${routes.sourcesDetail.path}`, sourcesDataGraphQl[0].id);
      expect(screen.getByTestId('location-display').textContent).toEqual(expectedPath);
    });

    it('redirect to delete', async () => {
      const user = userEvent.setup();

      await act(async () => {
        await user.click(screen.getAllByLabelText('Kebab toggle')[0]);
      });
      await act(async () => {
        await user.click(screen.getByText('Remove').closest('button'));
      });

      const expectedPath = replaceRouteId(`/settings/integrations/${routes.sourcesRemove.path}`, sourcesDataGraphQl[0].id);
      expect(screen.getByTestId('location-display').textContent).toEqual(expectedPath);
    });

    it('pause source', async () => {
      const user = userEvent.setup();

      actions.pauseSource = jest.fn().mockImplementation(() => ({ type: 'undefined-pause' }));

      await waitFor(async () => {
        await user.click(screen.getAllByLabelText('Kebab toggle')[0]);
      });
      await waitFor(async () => {
        await user.click(screen.getByText('Pause'));
      });

      expect(actions.pauseSource).toHaveBeenCalledWith(sourcesDataGraphQl[0].id, sourcesDataGraphQl[0].name, expect.any(Object));

      const calledActions = store.getActions();
      expect(calledActions[calledActions.length - 1]).toEqual({ type: 'undefined-pause' });
    });
  });

  it('unpausing', async () => {
    const user = userEvent.setup();

    initialState = {
      ...initialState,
      sources: {
        ...initialState.sources,
        ...loadedProps,
        entities: [
          {
            ...sourcesDataGraphQl[0],
            paused_at: '123',
          },
        ],
      },
    };

    const store = mockStore(initialState);

    actions.resumeSource = jest.fn().mockImplementation(() => ({ type: 'undefined-resume' }));

    render(componentWrapperIntl(<SourcesTable {...initialProps} />, store));

    await waitFor(async () => {
      await user.click(screen.getAllByLabelText('Kebab toggle')[0]);
    });
    await waitFor(async () => {
      await user.click(screen.getByText('Resume'));
    });

    expect(actions.resumeSource).toHaveBeenCalledWith(sourcesDataGraphQl[0].id, sourcesDataGraphQl[0].name, expect.any(Object));

    const calledActions = store.getActions();
    expect(calledActions[calledActions.length - 1]).toEqual({ type: 'undefined-resume' });
  });

  it('calls sortEntities', async () => {
    const user = userEvent.setup();

    const spy = jest.spyOn(actions, 'sortEntities');

    initialState = {
      ...initialState,
      sources: {
        ...initialState.sources,
        ...loadedProps,
      },
    };

    const store = mockStore(initialState);

    render(componentWrapperIntl(<SourcesTable {...initialProps} />, store));

    await waitFor(async () => {
      await user.click(screen.getByText('Name'));
    });

    expect(spy).toHaveBeenCalledWith('name', 'asc');

    await waitFor(async () => {
      await user.click(screen.getByText('Type'));
    });

    expect(spy).toHaveBeenCalledWith('source_type_id', 'asc');
  });

  describe('helper functions', () => {
    const INTL_MOCK = { formatMessage: ({ defaultMessage }) => defaultMessage };
    const pushMock = jest.fn();

    describe('prepareColumnsCells', () => {
      it('prepares columns cells', () => {
        const columns = [
          {
            title: 'name',
            value: 'name',
            searchable: true,
            formatter: 'nameFormatter',
            sortable: false,
          },
          {
            title: 'date',
            value: 'date',
            nonsense: true,
            sortable: true,
          },
        ];

        expect(prepareColumnsCells(columns)).toEqual([
          {
            title: 'name',
            value: 'name',
            transforms: [wrappable],
          },
          {
            title: 'date',
            value: 'date',
            transforms: [sortable, wrappable],
          },
        ]);
      });
    });

    describe('itemToCells', () => {
      it('no formatter and no value', () => {
        const appTypes = [];
        const sourceTypes = [];

        let item = { name: 'some-name' };
        let columns = [
          { title: 'Column 1', value: 'name' },
          { title: 'Column 2', value: 'missing-attribute' },
        ];

        expect(itemToCells(item, columns, sourceTypes, appTypes)).toEqual([{ title: 'some-name' }, { title: '' }]);
      });
    });

    describe('actionResolver', () => {
      const actionObject = (title) =>
        expect.objectContaining({
          title: title ? expect.stringContaining(title) : expect.any(String),
        });

      const EDIT_TITLE = 'Edit';
      const VIEW_TITLE = 'View details';
      const DELETE_TITLE = 'Remove';
      const PAUSE_TITLE = 'Pause';
      const UNPAUSE_TITLE = 'Resume';

      it('create actions for editable source', () => {
        const EDITABLE_DATA = { imported: undefined };

        const actions = actionResolver(INTL_MOCK, pushMock)(EDITABLE_DATA);

        expect(actions).toEqual([actionObject(PAUSE_TITLE), actionObject(DELETE_TITLE), actionObject(EDIT_TITLE)]);
      });

      it('create actions for paused source', () => {
        const EDITABLE_DATA = { imported: undefined, paused_at: 'today' };

        const actions = actionResolver(INTL_MOCK, pushMock)(EDITABLE_DATA);

        expect(actions).toEqual([actionObject(UNPAUSE_TITLE), actionObject(DELETE_TITLE), actionObject(VIEW_TITLE)]);
      });
    });
  });
});
