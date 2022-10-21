import React from 'react';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AddSourceWizard } from '../../../components/addSourceWizard/index';

import sourceTypes from '../../__mocks__/sourceTypes';
import applicationTypes from '../../__mocks__/applicationTypes';
import * as dependency from '../../../api/wizardHelpers';
import * as createSource from '../../../api/createSource';

import render from '../__mocks__/render';
import { ACCOUNT_AUTHORIZATION, MANUAL_CONFIGURATION } from '../../../components/constants';
import { CLOUD_VENDOR, GOOGLE_NAME, REDHAT_VENDOR } from '../../../utilities/constants';

describe('AddSourceWizard', () => {
  let initialProps;
  let SOURCE_DATA_OUT;

  beforeEach(() => {
    initialProps = {
      isOpen: true,
      sourceTypes,
      applicationTypes,
      onClose: jest.fn(),
      activeCategory: CLOUD_VENDOR,
    };

    SOURCE_DATA_OUT = {
      id: '1234',
      applications: [],
    };
  });

  it('renders correctly with sourceTypes', async () => {
    render(<AddSourceWizard {...initialProps} />);

    await waitFor(() => expect(screen.getByText('Select source type', { selector: 'button' })).toBeInTheDocument());
    expect(screen.getByText('Name source')).toBeInTheDocument();
    expect(screen.getAllByRole('dialog')).toBeTruthy();
  });

  it('renders correctly without sourceTypes', async () => {
    dependency.doLoadSourceTypes = jest.fn(() => new Promise((resolve) => resolve({ sourceTypes })));

    render(<AddSourceWizard {...initialProps} sourceTypes={undefined} />);

    await waitFor(() => expect(screen.getByText('Select source type', { selector: 'button' })).toBeInTheDocument());

    expect(screen.getAllByRole('dialog')).toBeTruthy();
    expect(dependency.doLoadSourceTypes).toHaveBeenCalled();
  });

  it('show finished step after filling the form', async () => {
    const user = userEvent.setup();

    createSource.doCreateSource = jest.fn(() => new Promise((resolve) => setTimeout(() => resolve(SOURCE_DATA_OUT), 100)));

    const { container } = render(<AddSourceWizard {...initialProps} />);

    await waitFor(() => expect(screen.getByText('Select source type', { selector: 'button' })).toBeInTheDocument());

    await user.click(screen.getByText('Google Cloud'));
    container.getElementsByTagName('form')[0].submit();

    expect(screen.getByText('Validating credentials')).toBeInTheDocument();

    await waitFor(() => expect(() => screen.getByText('Validating credentials')).toThrow());

    expect(screen.getByText('Configuration successful')).toBeInTheDocument();
  });

  it('pass created source to afterSuccess function', async () => {
    const user = userEvent.setup();

    const afterSubmitMock = jest.fn();
    createSource.doCreateSource = jest.fn(() => new Promise((resolve) => resolve({ name: 'source', applications: [] })));

    const { container } = render(<AddSourceWizard {...initialProps} afterSuccess={afterSubmitMock} />);

    await waitFor(() => expect(screen.getByText('Select source type', { selector: 'button' })).toBeInTheDocument());

    await user.click(screen.getByText('Google Cloud'));
    container.getElementsByTagName('form')[0].submit();
    await waitFor(() => expect(() => screen.getByText('Validating credentials')).toThrow());

    expect(afterSubmitMock).toHaveBeenCalledWith({ name: 'source', applications: [] });
  });

  it('pass created source to submitCallback function when success', async () => {
    const user = userEvent.setup();

    const submitCallback = jest.fn();
    createSource.doCreateSource = jest.fn(() => new Promise((resolve) => resolve({ name: 'source', applications: [] })));

    const { container } = render(<AddSourceWizard {...initialProps} submitCallback={submitCallback} />);

    await waitFor(() => expect(screen.getByText('Select source type', { selector: 'button' })).toBeInTheDocument());

    await user.click(screen.getByText('Google Cloud'));
    container.getElementsByTagName('form')[0].submit();

    await waitFor(() => expect(() => screen.getByText('Validating credentials')).toThrow());

    expect(submitCallback).toHaveBeenCalledWith({
      createdSource: { name: 'source', applications: [] },
      isSubmitted: true,
      sourceTypes,
    });
  });

  it('pass values to submitCallback function when errors', async () => {
    const user = userEvent.setup();

    const submitCallback = jest.fn();
    createSource.doCreateSource = jest.fn(() => new Promise((_, reject) => reject('Error - wrong name')));

    const { container } = render(<AddSourceWizard {...initialProps} submitCallback={submitCallback} />);

    await waitFor(() => expect(screen.getByText('Select source type', { selector: 'button' })).toBeInTheDocument());

    await user.click(screen.getByText('Google Cloud'));
    container.getElementsByTagName('form')[0].submit();

    await waitFor(() => expect(() => screen.getByText('Validating credentials')).toThrow());
    expect(submitCallback).toHaveBeenCalledWith({
      values: { source_type: GOOGLE_NAME },
      isErrored: true,
      sourceTypes,
      error: 'Error - wrong name',
      // because we are using form.submit in test instead of the button,
      // the state is not included
      wizardState: expect.any(Function),
    });
  });

  it('pass values to onClose function', async () => {
    const user = userEvent.setup();

    const onClose = jest.fn();

    render(<AddSourceWizard {...initialProps} onClose={onClose} />);

    await waitFor(() => expect(screen.getByText('Select source type', { selector: 'button' })).toBeInTheDocument());

    await user.click(screen.getByText('Google Cloud'));
    await user.click(screen.getByLabelText('Close wizard'));

    expect(screen.getByText('Exit source creation?')).toBeInTheDocument();
    await user.click(screen.getByText('Exit'));
    expect(onClose).toHaveBeenCalledWith({ source_type: GOOGLE_NAME });
  });

  it('stay on the wizard', async () => {
    const user = userEvent.setup();

    const onClose = jest.fn();

    render(<AddSourceWizard {...initialProps} onClose={onClose} />);

    await waitFor(() => expect(screen.getByText('Select source type', { selector: 'button' })).toBeInTheDocument());

    await user.click(screen.getByText('Google Cloud'));
    await user.click(screen.getByLabelText('Close wizard'));
    await user.click(screen.getByText('Stay'));

    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByText('Google Cloud').closest('.pf-m-selected')).toBeInTheDocument();
  });

  it('show error step after failing the form', async () => {
    const user = userEvent.setup();

    const ERROR_MESSAGE = 'fail';
    createSource.doCreateSource = jest.fn(() => new Promise((_resolve, reject) => reject(ERROR_MESSAGE)));

    const { container } = render(<AddSourceWizard {...initialProps} />);

    await waitFor(() => expect(screen.getByText('Select source type', { selector: 'button' })).toBeInTheDocument());

    await user.click(screen.getByText('Google Cloud'));
    container.getElementsByTagName('form')[0].submit();

    await waitFor(() => expect(() => screen.getByText('Validating credentials')).toThrow());

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(
      screen.getByText(
        'There was a problem while trying to add your source. Please try again. If the error persists, open a support case.'
      )
    ).toBeInTheDocument();
  });

  it('afterError closes wizard with no values', async () => {
    const user = userEvent.setup();

    const closeCallback = jest.fn();

    createSource.doCreateSource = jest.fn(() => Promise.reject('error'));

    const { container } = render(<AddSourceWizard {...initialProps} onClose={closeCallback} />);

    await waitFor(() => expect(screen.getByText('Select source type', { selector: 'button' })).toBeInTheDocument());

    await user.click(screen.getByText('Google Cloud'));
    container.getElementsByTagName('form')[0].submit();

    await waitFor(() => expect(() => screen.getByText('Validating credentials')).toThrow());

    expect(closeCallback).not.toHaveBeenCalled();

    await user.click(screen.getByLabelText('Close'));

    expect(closeCallback).toHaveBeenCalledWith({});
  });

  it('afterSubmit closes wizard with values', async () => {
    const user = userEvent.setup();

    const closeCallback = jest.fn();

    createSource.doCreateSource = jest.fn(() => Promise.resolve(SOURCE_DATA_OUT));

    const { container } = render(<AddSourceWizard {...initialProps} onClose={closeCallback} />);

    await waitFor(() => expect(screen.getByText('Select source type', { selector: 'button' })).toBeInTheDocument());

    await user.click(screen.getByText('Google Cloud'));
    container.getElementsByTagName('form')[0].submit();

    await waitFor(() => expect(() => screen.getByText('Validating credentials')).toThrow());

    expect(closeCallback).not.toHaveBeenCalled();

    await user.click(screen.getByLabelText('Close'));

    await waitFor(() => expect(closeCallback).toHaveBeenCalledWith(undefined, SOURCE_DATA_OUT));
  });

  it('reset - resets initialValues', async () => {
    const user = userEvent.setup();

    createSource.doCreateSource = jest.fn(() => Promise.resolve(SOURCE_DATA_OUT));

    const { container } = render(<AddSourceWizard {...initialProps} />);

    await waitFor(() => expect(screen.getByText('Select source type', { selector: 'button' })).toBeInTheDocument());

    await user.click(screen.getByText('Google Cloud'));
    container.getElementsByTagName('form')[0].submit();

    await waitFor(() => expect(() => screen.getByText('Validating credentials')).toThrow());

    await user.click(screen.getByText('Add another source'));

    expect(screen.getByText('Google Cloud').closest('.pf-m-selected')).toBeNull();
  });

  it('tryAgain retries the request', async () => {
    const user = userEvent.setup();

    createSource.doCreateSource = jest.fn(() => Promise.reject('error'));

    const { container } = render(<AddSourceWizard {...initialProps} />);

    await waitFor(() => expect(screen.getByText('Select source type', { selector: 'button' })).toBeInTheDocument());

    await user.click(screen.getByText('Google Cloud'));
    container.getElementsByTagName('form')[0].submit();

    await waitFor(() => expect(() => screen.getByText('Validating credentials')).toThrow());
    createSource.doCreateSource.mockClear();
    expect(createSource.doCreateSource).not.toHaveBeenCalled();

    await user.click(screen.getByText('Retry'));

    await waitFor(() =>
      expect(createSource.doCreateSource).toHaveBeenCalledWith({ source_type: GOOGLE_NAME }, expect.any(Array), applicationTypes)
    );
  });

  describe('different variants', () => {
    const getNavigation = (container) =>
      [...container.parentElement.getElementsByClassName('pf-c-wizard__nav-item')].map((item) => item.textContent);

    it('show configuration step when selectedType is set - CLOUD', async () => {
      const { container } = render(<AddSourceWizard {...initialProps} selectedType="amazon" activeCategory={CLOUD_VENDOR} />);

      await waitFor(() => expect(screen.getByText('Name source', { selector: 'button' })).toBeInTheDocument());

      expect(getNavigation(container)).toEqual(['Name source', 'Select configuration']);
    });

    it('show source type selection when CLOUD', async () => {
      const { container } = render(
        <AddSourceWizard {...initialProps} initialValues={{ source_type: 'amazon' }} activeCategory={CLOUD_VENDOR} />
      );

      await waitFor(() => expect(screen.getByText('Name source', { selector: 'button' })).toBeInTheDocument());

      expect(getNavigation(container)).toEqual(['Select source type', 'Name source', 'Select configuration']);
    });

    it('show application step when selectedType is set and configuration is selected to true', async () => {
      const { container } = render(
        <AddSourceWizard
          {...initialProps}
          selectedType="amazon"
          initialValues={{ source: { app_creation_workflow: ACCOUNT_AUTHORIZATION } }}
          activeCategory={CLOUD_VENDOR}
        />
      );

      await waitFor(() => expect(screen.getByText('Name source', { selector: 'button' })).toBeInTheDocument());

      expect(getNavigation(container)).toEqual(['Name source', 'Select configuration', 'Select applications', 'Review details']);
    });

    it('show application step when selectedType is set and configuration is selected to false', async () => {
      const { container } = render(
        <AddSourceWizard
          {...initialProps}
          selectedType="amazon"
          initialValues={{ source: { app_creation_workflow: MANUAL_CONFIGURATION } }}
          activeCategory={CLOUD_VENDOR}
        />
      );

      await waitFor(() => expect(screen.getByText('Name source', { selector: 'button' })).toBeInTheDocument());

      expect(getNavigation(container)).toEqual(['Name source', 'Select configuration', 'Select application', 'Credentials']);
    });

    it('show application step when selectedType is set - RED HAT', async () => {
      const { container } = render(<AddSourceWizard {...initialProps} selectedType="openshift" activeCategory={REDHAT_VENDOR} />);

      await waitFor(() => expect(screen.getByText('Name source', { selector: 'button' })).toBeInTheDocument());

      expect(getNavigation(container)).toEqual([
        'Name source',
        'Select application',
        'Credentials',
        'Configure OpenShift endpoint',
        'Review details',
      ]);
    });

    it('show source type selection when REDHAT', async () => {
      const { container } = render(<AddSourceWizard {...initialProps} activeCategory={REDHAT_VENDOR} />);

      await waitFor(() => expect(screen.getByText('Name source', { selector: 'button' })).toBeInTheDocument());

      expect(getNavigation(container)).toEqual(['Source type and application', 'Name source']);
    });
  });

  it('pass initialWizardState to wizard', async () => {
    await act(async () => {
      render(<AddSourceWizard {...initialProps} initialWizardState={{ activeStep: 'name_step' }} />);
    });

    await waitFor(() => expect(screen.getByText('Enter a name for your source.')).toBeInTheDocument());
  });
});
