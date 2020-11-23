import { onSubmit } from '../../../components/SourceEditForm/onSubmit';
import * as actions from '../../../redux/sources/actions';
import * as checkSourceStatus from '../../../api/checkSourceStatus';
import * as doUpdateSource from '../../../api/doUpdateSource';
import * as doLoadSourceForEdit from '../../../api/doLoadSourceForEdit';

import * as getAppStatus from '@redhat-cloud-services/frontend-components-sources/cjs/getApplicationStatus';
import { UNAVAILABLE, AVAILABLE } from '../../../views/formatters';

describe('editSourceModal - on submit', () => {
  let VALUES;
  let EDITING;
  let DISPATCH;
  let SOURCE;
  let INTL;
  let SET_STATE;

  const SOURCE_DATA = {
    id: 'some-source',
  };

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
    doLoadSourceForEdit.doLoadSourceForEdit = jest.fn().mockImplementation(() => Promise.resolve(SOURCE_DATA));
  });

  it('submit values successfuly with cost management', async () => {
    const HAS_COST_MANAGAMENT = true;

    doUpdateSource.doUpdateSource = jest.fn().mockImplementation(() => Promise.resolve('OK'));

    const FILTERED_VALUES = {
      source: {
        type: 'openshift',
      },
    };

    await onSubmit(VALUES, EDITING, DISPATCH, SOURCE, INTL, SET_STATE, HAS_COST_MANAGAMENT);

    expect(doUpdateSource.doUpdateSource).toHaveBeenCalledWith(SOURCE, FILTERED_VALUES);
    expect(SET_STATE.mock.calls[0][0]).toEqual({
      type: 'submit',
      values: VALUES,
      editing: EDITING,
    });
    expect(actions.loadEntities).toHaveBeenCalled();
    expect(checkSourceStatus.checkSourceStatus).toHaveBeenCalledWith('2342');
    expect(doLoadSourceForEdit.doLoadSourceForEdit).toHaveBeenCalledWith(
      {
        id: SOURCE.source.id,
      },
      HAS_COST_MANAGAMENT
    );
    expect(SET_STATE.mock.calls[1][0]).toEqual({
      type: 'submitFinished',
      source: SOURCE_DATA,
      message: {
        variant: 'success',
        title: 'Source ‘{name}’ was edited successfully.',
      },
    });
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
      endpoints: [
        {
          id: ENDPOINT_ID,
        },
      ],
    };

    await onSubmit(VALUES, EDITING, DISPATCH, SOURCE, INTL, SET_STATE);

    expect(doUpdateSource.doUpdateSource).toHaveBeenCalledWith(SOURCE, FILTERED_VALUES);
    expect(SET_STATE.mock.calls[0][0]).toEqual({
      type: 'submit',
      values: VALUES,
      editing: EDITING,
    });
    expect(actions.loadEntities).toHaveBeenCalled();
    expect(checkSourceStatus.checkSourceStatus).toHaveBeenCalledWith('2342');
    expect(doLoadSourceForEdit.doLoadSourceForEdit).toHaveBeenCalledWith(
      {
        id: SOURCE.source.id,
      },
      undefined
    );
    expect(SET_STATE.mock.calls[1][0]).toEqual({
      type: 'submitFinished',
      source: SOURCE_DATA,
      message: {
        variant: 'success',
        title: 'Source ‘{name}’ was edited successfully.',
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

    await onSubmit(VALUES, EDITING, DISPATCH, SOURCE, INTL, SET_STATE);

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
      applications: [{ id: 'application-id' }],
    };

    doUpdateSource.doUpdateSource = jest.fn().mockImplementation(() => Promise.resolve('OK'));

    const FILTERED_VALUES = {
      source: {
        type: 'openshift',
      },
    };

    await onSubmit(VALUES, EDITING, DISPATCH, SOURCE, INTL, SET_STATE);

    expect(doUpdateSource.doUpdateSource).toHaveBeenCalledWith(SOURCE, FILTERED_VALUES);
    expect(SET_STATE.mock.calls[0][0]).toEqual({
      type: 'submit',
      values: VALUES,
      editing: EDITING,
    });
    expect(actions.loadEntities).toHaveBeenCalled();
    expect(checkSourceStatus.checkSourceStatus).toHaveBeenCalledWith('2342');
    expect(doLoadSourceForEdit.doLoadSourceForEdit).toHaveBeenCalledWith(
      {
        id: SOURCE.source.id,
      },
      undefined
    );
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
      })
    );

    SOURCE = {
      ...SOURCE,
      applications: [{ id: 'application-id' }],
    };

    doUpdateSource.doUpdateSource = jest.fn().mockImplementation(() => Promise.resolve('OK'));

    const FILTERED_VALUES = {
      source: {
        type: 'openshift',
      },
    };

    await onSubmit(VALUES, EDITING, DISPATCH, SOURCE, INTL, SET_STATE);

    expect(doUpdateSource.doUpdateSource).toHaveBeenCalledWith(SOURCE, FILTERED_VALUES);
    expect(SET_STATE.mock.calls[0][0]).toEqual({
      type: 'submit',
      values: VALUES,
      editing: EDITING,
    });
    expect(actions.loadEntities).toHaveBeenCalled();
    expect(checkSourceStatus.checkSourceStatus).toHaveBeenCalledWith('2342');
    expect(doLoadSourceForEdit.doLoadSourceForEdit).toHaveBeenCalledWith(
      {
        id: SOURCE.source.id,
      },
      undefined
    );
    expect(getAppStatus.checkAppAvailability).toHaveBeenCalledWith(
      'application-id',
      undefined,
      undefined,
      undefined,
      expect.any(Date)
    );
    expect(SET_STATE.mock.calls[1][0]).toEqual({
      type: 'submitFinished',
      source: SOURCE_DATA,
      message: {
        variant: 'danger',
        title: 'Edit source failed',
        description: APP_ERROR,
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
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          availability_status: UNAVAILABLE,
          availability_status_error: APP_ERROR,
        })
      );

    SOURCE = {
      ...SOURCE,
      applications: [{ id: 'application-id' }, { id: 'application-id-2' }],
    };

    doUpdateSource.doUpdateSource = jest.fn().mockImplementationOnce(() => Promise.resolve('OK'));

    const FILTERED_VALUES = {
      source: {
        type: 'openshift',
      },
    };

    await onSubmit(VALUES, EDITING, DISPATCH, SOURCE, INTL, SET_STATE);

    expect(doUpdateSource.doUpdateSource).toHaveBeenCalledWith(SOURCE, FILTERED_VALUES);
    expect(SET_STATE.mock.calls[0][0]).toEqual({
      type: 'submit',
      values: VALUES,
      editing: EDITING,
    });
    expect(actions.loadEntities).toHaveBeenCalled();
    expect(checkSourceStatus.checkSourceStatus).toHaveBeenCalledWith('2342');
    expect(doLoadSourceForEdit.doLoadSourceForEdit).toHaveBeenCalledWith(
      {
        id: SOURCE.source.id,
      },
      undefined
    );
    expect(getAppStatus.checkAppAvailability.mock.calls[0][0]).toEqual('application-id');
    expect(getAppStatus.checkAppAvailability.mock.calls[1][0]).toEqual('application-id-2');
    expect(SET_STATE.mock.calls[1][0]).toEqual({
      type: 'submitFinished',
      source: SOURCE_DATA,
      message: {
        variant: 'danger',
        title: 'Edit source failed',
        description: APP_ERROR,
      },
    });
  });

  it('check app availablity status - timeout', async () => {
    getAppStatus.checkAppAvailability = jest.fn().mockImplementation(() =>
      Promise.resolve({
        availability_status: null,
      })
    );

    SOURCE = {
      ...SOURCE,
      applications: [{ id: 'application-id' }],
    };

    doUpdateSource.doUpdateSource = jest.fn().mockImplementation(() => Promise.resolve('OK'));

    const FILTERED_VALUES = {
      source: {
        type: 'openshift',
      },
    };

    await onSubmit(VALUES, EDITING, DISPATCH, SOURCE, INTL, SET_STATE);

    expect(doUpdateSource.doUpdateSource).toHaveBeenCalledWith(SOURCE, FILTERED_VALUES);
    expect(SET_STATE.mock.calls[0][0]).toEqual({
      type: 'submit',
      values: VALUES,
      editing: EDITING,
    });
    expect(actions.loadEntities).toHaveBeenCalled();
    expect(checkSourceStatus.checkSourceStatus).toHaveBeenCalledWith('2342');
    expect(doLoadSourceForEdit.doLoadSourceForEdit).toHaveBeenCalledWith(
      {
        id: SOURCE.source.id,
      },
      undefined
    );
    expect(getAppStatus.checkAppAvailability).toHaveBeenCalledWith(
      'application-id',
      undefined,
      undefined,
      undefined,
      expect.any(Date)
    );
    expect(SET_STATE.mock.calls[1][0]).toEqual({
      type: 'submitTimetouted',
    });
  });

  it('check app availablity status - available', async () => {
    getAppStatus.checkAppAvailability = jest.fn().mockImplementation(() =>
      Promise.resolve({
        availability_status: AVAILABLE,
      })
    );

    SOURCE = {
      ...SOURCE,
      applications: [{ id: 'application-id' }],
    };

    doUpdateSource.doUpdateSource = jest.fn().mockImplementation(() => Promise.resolve('OK'));

    const FILTERED_VALUES = {
      source: {
        type: 'openshift',
      },
    };

    await onSubmit(VALUES, EDITING, DISPATCH, SOURCE, INTL, SET_STATE);

    expect(doUpdateSource.doUpdateSource).toHaveBeenCalledWith(SOURCE, FILTERED_VALUES);
    expect(SET_STATE.mock.calls[0][0]).toEqual({
      type: 'submit',
      values: VALUES,
      editing: EDITING,
    });
    expect(actions.loadEntities).toHaveBeenCalled();
    expect(checkSourceStatus.checkSourceStatus).toHaveBeenCalledWith('2342');
    expect(doLoadSourceForEdit.doLoadSourceForEdit).toHaveBeenCalledWith(
      {
        id: SOURCE.source.id,
      },
      undefined
    );
    expect(getAppStatus.checkAppAvailability).toHaveBeenCalledWith(
      'application-id',
      undefined,
      undefined,
      undefined,
      expect.any(Date)
    );
    expect(SET_STATE.mock.calls[1][0]).toEqual({
      type: 'submitFinished',
      source: SOURCE_DATA,
      message: {
        variant: 'success',
        title: 'Source ‘{name}’ was edited successfully.',
      },
    });
  });
});
