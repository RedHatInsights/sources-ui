import { onSubmit } from '../../../components/SourceEditForm/onSubmit';
import * as actions from '../../../redux/sources/actions';
import * as checkSourceStatus from '../../../api/checkSourceStatus';
import * as doUpdateSource from '../../../api/doUpdateSource';

import * as getAppStatus from '@redhat-cloud-services/frontend-components-sources/cjs/getApplicationStatus';
import { UNAVAILABLE, AVAILABLE } from '../../../views/formatters';
import applicationTypesData from '../../__mocks__/applicationTypesData';

describe('editSourceModal - on submit', () => {
  let VALUES;
  let EDITING;
  let DISPATCH;
  let SOURCE;
  let INTL;
  let SET_STATE;
  const APP_TYPES = applicationTypesData.data;

  let formatMessageMock;

  beforeEach(() => {
    formatMessageMock = jest.fn().mockImplementation(({ defaultMessage }) => defaultMessage);

    VALUES = {
      source: {
        name: 'name',
        type: 'openshift',
      },
    };
    EDITING = {
      'source.type': true,
    };
    DISPATCH = jest.fn().mockImplementation((func) => func);
    SOURCE = {
      source: {
        name: 'aaa',
        id: '2342',
      },
    };
    INTL = {
      formatMessage: formatMessageMock,
    };
    SET_STATE = jest.fn();
    checkSourceStatus.checkSourceStatus = jest.fn().mockImplementation(() => Promise.resolve());
    actions.loadEntities = jest.fn();
  });

  it('checks endpoint availability', async () => {
    doUpdateSource.doUpdateSource = jest.fn().mockImplementation(() => Promise.resolve('OK'));

    const ENDPOINT_ID = '123698623259';

    getAppStatus.checkAppAvailability = jest.fn().mockImplementation(() =>
      Promise.resolve({
        availability_status: 'available',
      })
    );

    const FILTERED_VALUES = {
      source: {
        type: 'openshift',
      },
    };

    SOURCE = {
      ...SOURCE,
      applications: [{ id: '123', authentications: [{ id: '123', resource_type: 'Endpoint' }] }],
      endpoints: [
        {
          id: ENDPOINT_ID,
        },
      ],
    };

    EDITING = {
      ...EDITING,
      url: true,
    };

    await onSubmit(VALUES, EDITING, DISPATCH, SOURCE, INTL, SET_STATE, APP_TYPES);

    expect(doUpdateSource.doUpdateSource).toHaveBeenCalledWith(SOURCE, FILTERED_VALUES);
    expect(SET_STATE.mock.calls[0][0]).toEqual({
      type: 'submit',
      values: VALUES,
      editing: EDITING,
    });
    expect(actions.loadEntities).toHaveBeenCalled();
    expect(checkSourceStatus.checkSourceStatus).toHaveBeenCalledWith('2342');
    expect(SET_STATE.mock.calls[1][0]).toEqual({
      type: 'submitFinished',
      messages: {
        123: {
          variant: 'success',
          title: 'Application credentials were edited successfully.',
        },
      },
    });
    expect(getAppStatus.checkAppAvailability).toHaveBeenCalledWith(
      ENDPOINT_ID,
      undefined,
      undefined,
      'getEndpoint',
      expect.any(Date)
    );
  });

  it('submit values unsuccessfuly when submit error', async () => {
    doUpdateSource.doUpdateSource = jest.fn().mockImplementation(() => Promise.reject('FAILS'));

    await onSubmit(VALUES, EDITING, DISPATCH, SOURCE, INTL, SET_STATE, APP_TYPES);

    expect(actions.loadEntities).toHaveBeenCalled();
    expect(checkSourceStatus.checkSourceStatus).not.toHaveBeenCalled();
    expect(SET_STATE.mock.calls[0][0]).toEqual({
      type: 'submit',
      values: VALUES,
      editing: EDITING,
    });
    expect(SET_STATE.mock.calls[1][0]).toEqual({
      type: 'submitFailed',
    });
  });

  it('check app availablity status fails', async () => {
    getAppStatus.checkAppAvailability = jest.fn().mockImplementation(() => Promise.reject('FAILS'));

    SOURCE = {
      ...SOURCE,
      applications: [{ id: 'application-id', authentications: [{ id: '123', resource_type: 'Application' }] }],
    };

    EDITING = {
      ...EDITING,
      'authentications.a123.username': true,
    };

    doUpdateSource.doUpdateSource = jest.fn().mockImplementation(() => Promise.resolve('OK'));

    const FILTERED_VALUES = {
      source: {
        type: 'openshift',
      },
      authentications: {
        a123: { username: undefined },
      },
    };

    await onSubmit(VALUES, EDITING, DISPATCH, SOURCE, INTL, SET_STATE, APP_TYPES);

    expect(doUpdateSource.doUpdateSource).toHaveBeenCalledWith(SOURCE, FILTERED_VALUES);
    expect(SET_STATE.mock.calls[0][0]).toEqual({
      type: 'submit',
      values: VALUES,
      editing: EDITING,
    });
    expect(actions.loadEntities).toHaveBeenCalled();
    expect(checkSourceStatus.checkSourceStatus).toHaveBeenCalledWith('2342');
    expect(getAppStatus.checkAppAvailability).toHaveBeenCalledWith(
      'application-id',
      undefined,
      undefined,
      undefined,
      expect.any(Date)
    );
    expect(SET_STATE.mock.calls[1][0]).toEqual({
      type: 'submitFailed',
    });
  });

  it('check app availablity status - unavailable source', async () => {
    const APP_ERROR = 'some input error';

    getAppStatus.checkAppAvailability = jest.fn().mockImplementation(() =>
      Promise.resolve({
        availability_status: UNAVAILABLE,
        availability_status_error: APP_ERROR,
        id: 'application-id',
      })
    );

    SOURCE = {
      ...SOURCE,
      applications: [{ id: 'application-id', authentications: [{ id: '123', resource_type: 'Application' }] }],
    };

    EDITING = {
      ...EDITING,
      'authentications.a123.username': true,
    };

    doUpdateSource.doUpdateSource = jest.fn().mockImplementation(() => Promise.resolve('OK'));

    const FILTERED_VALUES = {
      source: {
        type: 'openshift',
      },
      authentications: {
        a123: { username: undefined },
      },
    };

    await onSubmit(VALUES, EDITING, DISPATCH, SOURCE, INTL, SET_STATE, APP_TYPES);

    expect(doUpdateSource.doUpdateSource).toHaveBeenCalledWith(SOURCE, FILTERED_VALUES);
    expect(SET_STATE.mock.calls[0][0]).toEqual({
      type: 'submit',
      values: VALUES,
      editing: EDITING,
    });
    expect(actions.loadEntities).toHaveBeenCalled();
    expect(checkSourceStatus.checkSourceStatus).toHaveBeenCalledWith('2342');
    expect(getAppStatus.checkAppAvailability).toHaveBeenCalledWith(
      'application-id',
      undefined,
      undefined,
      undefined,
      expect.any(Date)
    );
    expect(SET_STATE.mock.calls[1][0]).toEqual({
      type: 'submitFinished',
      messages: {
        'application-id': {
          variant: 'danger',
          title: 'Edit application credentials failed.',
          description: APP_ERROR,
        },
      },
    });
  });

  it('check app availablity status - multiple apps - unavailable source', async () => {
    const APP_ERROR = 'some input error';

    getAppStatus.checkAppAvailability = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          availability_status: AVAILABLE,
          id: 'application-id-1',
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          availability_status: UNAVAILABLE,
          availability_status_error: APP_ERROR,
          id: 'application-id-2',
        })
      );

    SOURCE = {
      ...SOURCE,
      applications: [
        { id: 'application-id', authentications: [{ id: '123', resource_type: 'Application' }] },
        { id: 'application-id-2', authentications: [{ id: '245', resource_type: 'Application' }] },
      ],
    };

    EDITING = {
      ...EDITING,
      'authentications.a123.username': true,
      'authentications.a245.username': true,
    };

    doUpdateSource.doUpdateSource = jest.fn().mockImplementation(() => Promise.resolve('OK'));

    const FILTERED_VALUES = {
      source: {
        type: 'openshift',
      },
      authentications: {
        a123: { username: undefined },
        a245: { username: undefined },
      },
    };

    await onSubmit(VALUES, EDITING, DISPATCH, SOURCE, INTL, SET_STATE, APP_TYPES);

    expect(doUpdateSource.doUpdateSource).toHaveBeenCalledWith(SOURCE, FILTERED_VALUES);
    expect(SET_STATE.mock.calls[0][0]).toEqual({
      type: 'submit',
      values: VALUES,
      editing: EDITING,
    });
    expect(actions.loadEntities).toHaveBeenCalled();
    expect(checkSourceStatus.checkSourceStatus).toHaveBeenCalledWith('2342');
    expect(getAppStatus.checkAppAvailability.mock.calls[0][0]).toEqual('application-id');
    expect(getAppStatus.checkAppAvailability.mock.calls[1][0]).toEqual('application-id-2');
    expect(SET_STATE.mock.calls[1][0]).toEqual({
      type: 'submitFinished',
      messages: {
        'application-id-1': {
          variant: 'success',
          title: 'Application credentials were edited successfully.',
        },
        'application-id-2': {
          variant: 'danger',
          title: 'Edit application credentials failed.',
          description: APP_ERROR,
        },
      },
    });
  });

  it('check app availablity status - unavailable endpoint', async () => {
    const ERROR = 'some endpoint error';

    getAppStatus.checkAppAvailability = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        availability_status: UNAVAILABLE,
        role: 'ansible',
        availability_status_error: ERROR,
      })
    );

    SOURCE = {
      ...SOURCE,
      endpoints: [{ id: 'endpoint-id' }],
      applications: [{ id: 'application-id', authentications: [{ id: '123', resource_type: 'Endpoint' }] }],
    };

    EDITING = {
      ...EDITING,
      'authentications.a123.username': true,
    };

    doUpdateSource.doUpdateSource = jest.fn().mockImplementation(() => Promise.resolve('OK'));

    const FILTERED_VALUES = {
      source: {
        type: 'openshift',
      },
      authentications: {
        a123: { username: undefined },
      },
    };

    await onSubmit(VALUES, EDITING, DISPATCH, SOURCE, INTL, SET_STATE, APP_TYPES);

    expect(doUpdateSource.doUpdateSource).toHaveBeenCalledWith(SOURCE, FILTERED_VALUES);
    expect(SET_STATE.mock.calls[0][0]).toEqual({
      type: 'submit',
      values: VALUES,
      editing: EDITING,
    });
    expect(actions.loadEntities).toHaveBeenCalled();
    expect(checkSourceStatus.checkSourceStatus).toHaveBeenCalledWith('2342');
    expect(getAppStatus.checkAppAvailability).toHaveBeenCalledWith(
      'endpoint-id',
      undefined,
      undefined,
      'getEndpoint',
      expect.any(Date)
    );
    expect(SET_STATE.mock.calls[1][0]).toEqual({
      type: 'submitFinished',
      messages: {
        'application-id': {
          variant: 'danger',
          title: 'Edit application credentials failed.',
          description: ERROR,
        },
      },
    });
  });

  it('check app availablity status - timeout', async () => {
    getAppStatus.checkAppAvailability = jest.fn().mockImplementation(() =>
      Promise.resolve({
        availability_status: null,
        id: 'application-id',
      })
    );

    SOURCE = {
      ...SOURCE,
      applications: [{ id: 'application-id', authentications: [{ id: '123', resource_type: 'Application' }] }],
    };

    EDITING = {
      ...EDITING,
      'authentications.a123.username': true,
    };

    doUpdateSource.doUpdateSource = jest.fn().mockImplementation(() => Promise.resolve('OK'));

    const FILTERED_VALUES = {
      source: {
        type: 'openshift',
      },
      authentications: {
        a123: { username: undefined },
      },
    };

    await onSubmit(VALUES, EDITING, DISPATCH, SOURCE, INTL, SET_STATE, APP_TYPES);

    expect(doUpdateSource.doUpdateSource).toHaveBeenCalledWith(SOURCE, FILTERED_VALUES);
    expect(SET_STATE.mock.calls[0][0]).toEqual({
      type: 'submit',
      values: VALUES,
      editing: EDITING,
    });
    expect(actions.loadEntities).toHaveBeenCalled();
    expect(checkSourceStatus.checkSourceStatus).toHaveBeenCalledWith('2342');
    expect(getAppStatus.checkAppAvailability).toHaveBeenCalledWith(
      'application-id',
      undefined,
      undefined,
      undefined,
      expect.any(Date)
    );
    expect(SET_STATE.mock.calls[1][0]).toEqual({
      type: 'submitFinished',
      messages: {
        'application-id': {
          variant: 'warning',
          title: 'Edit in progress',
          description:
            'We are still working to confirm your updated credentials. Changes will be reflected in this table when complete.',
        },
      },
    });
  });

  it('check app availablity status - available', async () => {
    getAppStatus.checkAppAvailability = jest.fn().mockImplementation(() =>
      Promise.resolve({
        id: 'application-id',
        availability_status: AVAILABLE,
      })
    );

    SOURCE = {
      ...SOURCE,
      applications: [{ id: 'application-id', authentications: [{ id: '123', resource_type: 'Application' }] }],
    };

    EDITING = {
      ...EDITING,
      'authentications.a123.username': true,
    };

    doUpdateSource.doUpdateSource = jest.fn().mockImplementation(() => Promise.resolve('OK'));

    const FILTERED_VALUES = {
      source: {
        type: 'openshift',
      },
      authentications: {
        a123: { username: undefined },
      },
    };

    await onSubmit(VALUES, EDITING, DISPATCH, SOURCE, INTL, SET_STATE, APP_TYPES);

    expect(doUpdateSource.doUpdateSource).toHaveBeenCalledWith(SOURCE, FILTERED_VALUES);
    expect(SET_STATE.mock.calls[0][0]).toEqual({
      type: 'submit',
      values: VALUES,
      editing: EDITING,
    });
    expect(actions.loadEntities).toHaveBeenCalled();
    expect(checkSourceStatus.checkSourceStatus).toHaveBeenCalledWith('2342');
    expect(getAppStatus.checkAppAvailability).toHaveBeenCalledWith(
      'application-id',
      undefined,
      undefined,
      undefined,
      expect.any(Date)
    );
    expect(SET_STATE.mock.calls[1][0]).toEqual({
      type: 'submitFinished',
      messages: {
        'application-id': {
          variant: 'success',
          title: 'Application credentials were edited successfully.',
        },
      },
    });
  });
});
