import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  afterSuccess,
  afterSuccessLoadParameters,
  checkSubmit,
  chipsFormatters,
  loadedTypes,
  prepareApplicationTypeSelection,
  prepareChips,
  prepareSourceTypeSelection,
  removeChips,
} from '../../../pages/Sources/helpers';

import * as actions from '../../../redux/sources/actions';
import sourceTypes, { AMAZON_TYPE, ANSIBLE_TOWER_TYPE, OPENSHIFT_TYPE } from '../../__mocks__/sourceTypes';
import applicationTypes, { CATALOG_APP } from '../../__mocks__/applicationTypes';
import { REDHAT_VENDOR } from '../../../utilities/constants';
import { AVAILABLE, UNAVAILABLE } from '../../../views/formatters';
import { replaceRouteId, routes } from '../../../Routing';

describe('Source page helpers', () => {
  describe('afterSuccess', () => {
    it('calls function and checks source availibility status', () => {
      const dispatch = jest.fn();
      const source = { id: '154586' };

      actions.loadEntities = jest.fn();

      afterSuccess(dispatch, source);

      expect(dispatch.mock.calls.length).toBe(1);
      expect(actions.loadEntities).toHaveBeenCalledWith(afterSuccessLoadParameters);
    });

    it('refresh table, do not check source when there is no one', () => {
      const dispatch = jest.fn();
      const source = undefined;

      actions.loadEntities = jest.fn();

      afterSuccess(dispatch, source);

      expect(dispatch.mock.calls.length).toBe(1);
      expect(actions.loadEntities).toHaveBeenCalledWith(afterSuccessLoadParameters);
    });
  });

  describe('chipsFormatters', () => {
    const NAME = 'some name';
    const filterValue = {
      name: NAME,
      source_type_id: ['3', '1', '333'],
      applications: ['1', '667'],
    };

    it('returns chip for name', () => {
      const key = 'name';

      expect(chipsFormatters('name', filterValue, sourceTypes)()).toEqual({
        key,
        name: NAME,
      });
    });

    it('returns chips for source_types', () => {
      const key = 'source_type_id';

      expect(chipsFormatters(key, filterValue, sourceTypes)()).toEqual({
        category: 'Source Type',
        key,
        chips: [
          {
            name: ANSIBLE_TOWER_TYPE.product_name,
            value: '3',
          },
          {
            name: OPENSHIFT_TYPE.product_name,
            value: '1',
          },
          {
            name: '333',
            value: '333',
          },
        ],
      });
    });

    it('returns chips for applications', () => {
      const key = 'applications';

      expect(chipsFormatters(key, filterValue, sourceTypes, applicationTypes)()).toEqual({
        category: 'Application',
        key,
        chips: [
          {
            name: CATALOG_APP.display_name,
            value: '1',
          },
          {
            name: '667',
            value: '667',
          },
        ],
      });
    });

    it('returns chips for unavailable status', () => {
      const key = 'availability_status';
      const intl = { formatMessage: ({ defaultMessage }) => defaultMessage };

      const filterValue = {
        availability_status: [UNAVAILABLE],
      };

      expect(chipsFormatters(key, filterValue, sourceTypes, applicationTypes, intl)()).toEqual({
        category: 'Status',
        chips: [{ name: 'Unavailable', value: 'unavailable' }],
        key: 'availability_status',
      });
    });

    it('returns chips for available status', () => {
      const key = 'availability_status';
      const intl = { formatMessage: ({ defaultMessage }) => defaultMessage };

      const filterValue = {
        availability_status: [AVAILABLE],
      };

      expect(chipsFormatters(key, filterValue, sourceTypes, applicationTypes, intl)()).toEqual({
        category: 'Status',
        chips: [{ name: 'Available', value: 'available' }],
        key: 'availability_status',
      });
    });

    it('returns chips for unknown', () => {
      const key = 'unknown';

      expect(chipsFormatters(key, filterValue, sourceTypes)()).toEqual({
        name: key,
      });
    });
  });

  describe('prepareSourceTypeSelection', () => {
    it('parses source types into selection', () => {
      const sourceTypes = [
        { id: '23', product_name: 'First type', vendor: REDHAT_VENDOR },
        { id: '12', product_name: 'Last type', vendor: REDHAT_VENDOR },
      ];

      expect(prepareSourceTypeSelection(sourceTypes)).toEqual([
        { label: 'First type', value: '23' },
        { label: 'Last type', value: '12' },
      ]);
    });

    it('selection is sorted alphabetically', () => {
      const sourceTypes = [
        { id: '12', product_name: 'Last type', vendor: REDHAT_VENDOR },
        { id: '23', product_name: 'First type', vendor: REDHAT_VENDOR },
      ];

      expect(prepareSourceTypeSelection(sourceTypes)).toEqual([
        { label: 'First type', value: '23' },
        { label: 'Last type', value: '12' },
      ]);
    });
  });

  describe('prepareApplicationTypeSelection', () => {
    it('parses application types into selection and selection is sorted alphabetically', () => {
      const appTypes = [
        { id: '23', display_name: 'B' },
        { id: '12', display_name: 'A' },
      ];

      expect(prepareApplicationTypeSelection(appTypes)).toEqual([
        { label: 'A', value: '12' },
        { label: 'B', value: '23' },
      ]);
    });
  });

  describe('removeChips', () => {
    const filterValue = {
      name: 'some name',
      source_type_id: ['3', '5', '333'],
    };

    it('deletes all chips', () => {
      const DELETE_ALL = true;

      expect(removeChips([], filterValue, DELETE_ALL)).toEqual({
        name: undefined,
        source_type_id: undefined,
      });
    });

    it('deletes name chip chips', () => {
      expect(removeChips([{ key: 'name' }], filterValue)).toEqual({
        name: undefined,
        source_type_id: ['3', '5', '333'],
      });
    });

    it('deletes one of source_types', () => {
      expect(removeChips([{ key: 'source_type_id', chips: [{ value: '5' }] }], filterValue)).toEqual({
        name: 'some name',
        source_type_id: ['3', '333'],
      });
    });
  });

  describe('prepareChips', () => {
    const filterValue = {
      name: 'some name',
      source_type_id: ['3', '5', '333'],
      applications: ['1', '667'],
      empty: [],
      undefined,
    };

    it('prepares chips', () => {
      expect(prepareChips(filterValue, sourceTypes, applicationTypes)).toEqual([
        chipsFormatters('name', filterValue, sourceTypes)(),
        chipsFormatters('source_type_id', filterValue, sourceTypes)(),
        chipsFormatters('applications', filterValue, sourceTypes, applicationTypes)(),
      ]);
    });
  });

  describe('loadedTypes', () => {
    let types;
    let loaded;

    it('returns types when loaded and length > 0', () => {
      types = [1, 2];
      loaded = true;

      expect(loadedTypes(types, loaded)).toEqual(types);
    });

    it('returns undefined when not loaded', () => {
      types = [1, 2];
      loaded = false;

      expect(loadedTypes(types, loaded)).toEqual(undefined);
    });

    it('returns undefined when length < 0', () => {
      types = [];
      loaded = true;

      expect(loadedTypes(types, loaded)).toEqual(undefined);
    });
  });

  describe('checkSubmit', () => {
    let tmpLocation;
    let state;
    let dispatch;
    let push;
    let intl;
    let stateDispatch;

    let messageActionLinks;
    let messageId;

    beforeEach(() => {
      tmpLocation = Object.assign({}, window.location);

      delete window.location;

      window.location = {};

      window.location.pathname = routes.sources.path;

      state = {};
      dispatch = jest.fn().mockImplementation((func) => func);
      push = jest.fn();
      intl = {
        formatMessage: ({ defaultMessage }) => defaultMessage.replace('{name}', 'some-name').replace('{type}', 'some-type'),
      };

      actions.addMessage = jest.fn().mockImplementation(({ actionLinks, id }) => {
        messageActionLinks = actionLinks;
        messageId = id;
      });
      actions.removeMessage = jest.fn();
    });

    afterEach(() => {
      window.location = tmpLocation;
    });

    it('is called when wizard is open', () => {
      window.location.pathname = routes.sourcesNew.path;

      checkSubmit(state, dispatch, push, intl);

      expect(dispatch).not.toHaveBeenCalled();
      expect(actions.addMessage).not.toHaveBeenCalled();
      expect(push).not.toHaveBeenCalled();
    });

    it('error', async () => {
      const user = userEvent.setup();

      stateDispatch = jest.fn();
      const wizardState = {
        activeStep: '123',
        activeStepIndex: '3',
        maxStepIndex: 3,
        prevSteps: ['prev-step'],
        registeredFieldsHistory: { cosi: ['name'] },
      };
      state = { isErrored: true, values: { source: { name: 'some-name' } }, error: 'some-error', wizardState };

      checkSubmit(state, dispatch, push, intl, stateDispatch);

      expect(dispatch).toHaveBeenCalled();
      expect(actions.addMessage).toHaveBeenCalledWith({
        actionLinks: expect.any(Object),
        id: expect.any(String),
        description:
          'There was a problem while trying to add source some-name. Please try again. If the error persists, open a support case.',
        title: 'Error adding source',
        variant: 'danger',
      });
      expect(push).not.toHaveBeenCalled();
      expect(stateDispatch).not.toHaveBeenCalled();

      render(messageActionLinks);

      await user.click(screen.getByText('Retry'));

      expect(push).toHaveBeenCalledWith(routes.sourcesNew.path);
      expect(actions.removeMessage).toHaveBeenCalledWith(messageId);
      expect(stateDispatch).toHaveBeenCalledWith({
        type: 'retryWizard',
        initialValues: { source: { name: 'some-name' } },
        initialState: wizardState,
      });
    });

    it('unavailable', async () => {
      const user = userEvent.setup();

      state = {
        isSubmitted: true,
        createdSource: {
          source_type_id: AMAZON_TYPE.id,
          id: '1234',
          name: 'some-name',
          applications: [{ availability_status: UNAVAILABLE, availability_status_error: 'Some app error' }],
        },
        sourceTypes: [AMAZON_TYPE],
      };

      checkSubmit(state, dispatch, push, intl);

      expect(dispatch).toHaveBeenCalled();
      expect(actions.addMessage).toHaveBeenCalledWith({
        actionLinks: expect.any(Object),
        id: expect.any(String),
        description: '{error} [<b>some-name</b>]',
        title: 'Source configuration unsuccessful',
        variant: 'danger',
      });
      expect(push).not.toHaveBeenCalled();

      render(messageActionLinks);

      await user.click(screen.getByText('Edit source'));

      expect(push).toHaveBeenCalledWith(replaceRouteId(routes.sourcesDetail.path, '1234'));
      expect(actions.removeMessage).toHaveBeenCalledWith(messageId);
    });

    it('unavailable - endpoint error', async () => {
      state = {
        isSubmitted: true,
        createdSource: {
          source_type_id: AMAZON_TYPE.id,
          id: '1234',
          name: 'some-name',
          applications: [],
          endpoint: [{ availability_status: UNAVAILABLE, availability_status_error: 'Some endpoint error' }],
        },
        sourceTypes: [AMAZON_TYPE],
      };

      checkSubmit(state, dispatch, push, intl);

      expect(actions.addMessage).toHaveBeenCalledWith({
        actionLinks: expect.any(Object),
        id: expect.any(String),
        description: '{error} [<b>some-name</b>]',
        title: 'Source configuration unsuccessful',
        variant: 'danger',
      });
    });

    it('unavailable - endpoint & unknown error', async () => {
      state = {
        isSubmitted: true,
        createdSource: {
          source_type_id: AMAZON_TYPE.id,
          id: '1234',
          name: 'some-name',
          applications: [],
          endpoint: [{ availability_status: UNAVAILABLE }],
        },
        sourceTypes: [AMAZON_TYPE],
      };

      checkSubmit(state, dispatch, push, intl);

      expect(actions.addMessage).toHaveBeenCalledWith({
        actionLinks: expect.any(Object),
        id: expect.any(String),
        description: '{error} [<b>some-name</b>]',
        title: 'Source configuration unsuccessful',
        variant: 'danger',
      });
    });

    it('timeout', () => {
      state = {
        isSubmitted: true,
        createdSource: {
          source_type_id: AMAZON_TYPE.id,
          name: 'some-name',
          applications: [{ availability_status: null }],
        },
        sourceTypes: [AMAZON_TYPE],
      };

      checkSubmit(state, dispatch, push, intl);

      expect(dispatch).toHaveBeenCalled();
      expect(actions.addMessage).toHaveBeenCalledWith({
        description:
          'We are still working to confirm credentials for source some-name. To track progress, check the Status column in the Sources table.',
        title: 'Source configuration in progress',
        variant: 'info',
      });
      expect(push).not.toHaveBeenCalled();
    });

    it('available', async () => {
      const user = userEvent.setup();

      state = {
        isSubmitted: true,
        createdSource: {
          source_type_id: AMAZON_TYPE.id,
          id: '1234',
          name: 'some-name',
          applications: [{ availability_status: AVAILABLE }],
        },
        sourceTypes: [AMAZON_TYPE],
      };

      checkSubmit(state, dispatch, push, intl);

      expect(dispatch).toHaveBeenCalled();
      expect(actions.addMessage).toHaveBeenCalledWith({
        actionLinks: expect.any(Object),
        id: expect.any(String),
        description: 'Source some-name was successfully added',
        title: 'some-type connection successful',
        variant: 'success',
      });
      expect(push).not.toHaveBeenCalled();

      render(messageActionLinks);

      await user.click(screen.getByText('View source details'));

      expect(push).toHaveBeenCalledWith(replaceRouteId(routes.sourcesDetail.path, '1234'));
      expect(actions.removeMessage).toHaveBeenCalledWith(messageId);
    });
  });
});
