import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AddSourceWizard from '../../../components/addSourceWizard/SourceAddModal';
import sourceTypes from '../../__mocks__/sourceTypes';
import applicationTypes from '../../__mocks__/applicationTypes';

import * as dependency from '../../../api/wizardHelpers';
import render from '../__mocks__/render';
import hcsEnrollment from '../../__mocks__/hcs';
import mockStore from '../../__mocks__/mockStore';
import componentWrapperIntl from '../../../utilities/testsHelpers';

describe('sourceAddModal', () => {
  let initialProps;
  let initialState;
  let spyFunction;
  let store;

  beforeEach(() => {
    spyFunction = jest.fn();

    initialProps = {
      isOpen: true,
      refreshSources: spyFunction,
      onCancel: jest.fn(),
      onSubmit: jest.fn(),
    };

    initialState = {
      sources: { hcsEnrolled: false, hcsEnrolledLoaded: true },
    };

    store = mockStore(initialState);
  });

  it('renders correctly with sourceTypes and applicationTypes', async () => {
    dependency.checkAccountHCS = jest.fn(() => new Promise((resolve) => resolve(hcsEnrollment)));
    render(
      componentWrapperIntl(
        <AddSourceWizard {...initialProps} sourceTypes={sourceTypes} applicationTypes={applicationTypes} />,
        store
      )
    );

    await waitFor(() => expect(screen.getByText('Select a cloud provider')).toBeInTheDocument());
  });

  it('renders correctly without sourceTypes', async () => {
    dependency.doLoadApplicationTypes = jest.fn(() => new Promise((resolve) => resolve({ applicationTypes })));
    dependency.doLoadSourceTypes = jest.fn(() => new Promise((resolve) => resolve({ sourceTypes })));
    dependency.checkAccountHCS = jest.fn(() => new Promise((resolve) => resolve(hcsEnrollment)));

    render(componentWrapperIntl(<AddSourceWizard {...initialProps} applicationTypes={applicationTypes} />, store));

    await waitFor(() => expect(screen.getByText('Select a cloud provider')).toBeInTheDocument());

    expect(dependency.doLoadSourceTypes).toHaveBeenCalled();
    expect(dependency.doLoadApplicationTypes).not.toHaveBeenCalled();
  });

  it('renders correctly without applicationTypes', async () => {
    dependency.doLoadSourceTypes = jest.fn(() => new Promise((resolve) => resolve({ sourceTypes })));
    dependency.doLoadApplicationTypes = jest.fn(() => new Promise((resolve) => resolve({ applicationTypes })));
    dependency.checkAccountHCS = jest.fn(() => new Promise((resolve) => resolve(hcsEnrollment)));

    render(componentWrapperIntl(<AddSourceWizard {...initialProps} sourceTypes={sourceTypes} />, store));

    await waitFor(() => expect(screen.getByText('Select a cloud provider')).toBeInTheDocument());

    expect(dependency.doLoadSourceTypes).not.toHaveBeenCalled();
    expect(dependency.doLoadApplicationTypes).toHaveBeenCalled();
  });

  it('renders correctly without sourceTypes and application types', async () => {
    dependency.doLoadSourceTypes = jest.fn(() => new Promise((resolve) => resolve({ sourceTypes })));
    dependency.doLoadApplicationTypes = jest.fn(() => new Promise((resolve) => resolve({ applicationTypes })));
    dependency.checkAccountHCS = jest.fn(() => new Promise((resolve) => resolve(hcsEnrollment)));

    render(componentWrapperIntl(<AddSourceWizard {...initialProps} />, store));

    await waitFor(() => expect(screen.getByText('Select a cloud provider')).toBeInTheDocument());

    expect(dependency.doLoadSourceTypes).toHaveBeenCalled();
    expect(dependency.doLoadApplicationTypes).toHaveBeenCalled();
  });

  it('clicks on onCancel when loading', async () => {
    const user = userEvent.setup();

    const onCancel = jest.fn();

    dependency.doLoadSourceTypes = mockApi();
    dependency.doLoadApplicationTypes = jest
      .fn()
      .mockImplementation(() => new Promise((resolve) => resolve({ applicationTypes })));
    dependency.checkAccountHCS = jest.fn(() => new Promise((resolve) => resolve(hcsEnrollment)));

    render(componentWrapperIntl(<AddSourceWizard {...initialProps} onCancel={onCancel} />, store));

    expect(screen.getByText('Loading')).toBeInTheDocument(1);

    expect(onCancel).not.toHaveBeenCalled();

    await user.click(screen.getAllByText('Cancel')[0]);

    expect(onCancel).toHaveBeenCalledWith();

    dependency.doLoadSourceTypes.resolve({ sourceTypes });

    await waitFor(() => expect(() => screen.getByText('Loading')).toThrow());
  });
});
