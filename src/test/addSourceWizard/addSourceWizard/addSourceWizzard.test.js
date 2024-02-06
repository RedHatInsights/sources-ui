import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AddSourceWizard from '../../../components/addSourceWizard';

import sourceTypes from '../../__mocks__/sourceTypes';
import applicationTypes from '../../__mocks__/applicationTypes';
import * as dependency from '../../../api/wizardHelpers';
import * as createSource from '../../../api/createSource';

import { ACCOUNT_AUTHORIZATION, MANUAL_CONFIGURATION } from '../../../components/constants';
import { CLOUD_VENDOR, GOOGLE_NAME, REDHAT_VENDOR } from '../../../utilities/constants';
import { defaultSourcesState } from '../../../redux/sources/reducer';
import hcsEnrollment from '../../__mocks__/hcs';
import componentWrapperIntl from '../../../utilities/testsHelpers';
import mockStore from '../../__mocks__/mockStore';

describe('AddSourceWizard', () => {
  let initialProps;
  let initialState;
  let SOURCE_DATA_OUT;
  let store;

  beforeEach(() => {
    initialProps = {
      isOpen: true,
      sourceTypes,
      applicationTypes,
      onClose: jest.fn(),
      activeCategory: CLOUD_VENDOR,
    };

    initialState = {
      sources: { ...defaultSourcesState, sourceTypes, hcsEnrolled: false, hcsEnrolledLoaded: true },
    };

    SOURCE_DATA_OUT = {
      id: '1234',
      applications: [],
    };

    store = mockStore(initialState);
  });

  it('renders correctly with sourceTypes', async () => {
    dependency.checkAccountHCS = jest.fn(() => new Promise((resolve) => resolve(hcsEnrollment)));
    render(componentWrapperIntl(<AddSourceWizard {...initialProps} />, store));

    await waitFor(() => expect(screen.getByText('Select cloud provider', { selector: 'button' })).toBeInTheDocument());
    expect(screen.getByText('Name integration')).toBeInTheDocument();
    expect(screen.getAllByRole('dialog')).toBeTruthy();
  });

  it('renders correctly without sourceTypes', async () => {
    dependency.checkAccountHCS = jest.fn(() => new Promise((resolve) => resolve(hcsEnrollment)));
    dependency.doLoadSourceTypes = jest.fn(() => new Promise((resolve) => resolve({ sourceTypes })));

    render(componentWrapperIntl(<AddSourceWizard {...initialProps} sourceTypes={undefined} />, store));

    await waitFor(() => expect(screen.getByText('Select cloud provider', { selector: 'button' })).toBeInTheDocument());

    expect(screen.getAllByRole('dialog')).toBeTruthy();
    expect(dependency.doLoadSourceTypes).toHaveBeenCalled();
  });

  // FIXME: Fails while running with the rest of tests. Success individually
  it.skip('show finished step after filling the form', async () => {
    const user = userEvent.setup();

    dependency.checkAccountHCS = jest.fn(() => new Promise((resolve) => resolve(hcsEnrollment)));
    createSource.doCreateSource = jest.fn(() => new Promise((resolve) => setTimeout(() => resolve(SOURCE_DATA_OUT), 100)));

    const { container } = render(componentWrapperIntl(<AddSourceWizard {...initialProps} />, store));

    await waitFor(() => expect(screen.getByText('Select cloud provider', { selector: 'button' })).toBeInTheDocument());
    await act(async () => {
      await user.click(screen.getByText('Google Cloud'));
    });

    await act(async () => {
      container.getElementsByTagName('form')[0].submit();
    });

    expect(screen.getByText('Validating credentials')).toBeInTheDocument();

    await waitFor(() => expect(() => screen.getByText('Validating credentials')).toThrow());

    expect(screen.getByText('Configuration successful')).toBeInTheDocument();
  });

  it('pass created source to afterSuccess function', async () => {
    const user = userEvent.setup();

    const afterSubmitMock = jest.fn();
    dependency.checkAccountHCS = jest.fn(() => new Promise((resolve) => resolve(hcsEnrollment)));
    createSource.doCreateSource = jest.fn(() => new Promise((resolve) => resolve({ name: 'source', applications: [] })));

    const { container } = render(
      componentWrapperIntl(<AddSourceWizard {...initialProps} afterSuccess={afterSubmitMock} />, store),
    );

    await waitFor(() => expect(screen.getByText('Select cloud provider', { selector: 'button' })).toBeInTheDocument());

    await waitFor(async () => {
      await user.click(screen.getByText('Google Cloud'));
    });
    await waitFor(async () => {
      container.getElementsByTagName('form')[0].submit();
    });
    await waitFor(() => expect(() => screen.getByText('Validating credentials')).toThrow());

    expect(afterSubmitMock).toHaveBeenCalledWith({ name: 'source', applications: [] });
  });

  it('pass created source to submitCallback function when success', async () => {
    const user = userEvent.setup();

    const submitCallback = jest.fn();
    dependency.checkAccountHCS = jest.fn(() => new Promise((resolve) => resolve(hcsEnrollment)));
    createSource.doCreateSource = jest.fn(() => new Promise((resolve) => resolve({ name: 'source', applications: [] })));

    const { container } = render(
      componentWrapperIntl(<AddSourceWizard {...initialProps} submitCallback={submitCallback} />, store),
    );

    await waitFor(() => expect(screen.getByText('Select cloud provider', { selector: 'button' })).toBeInTheDocument());

    await waitFor(async () => {
      await user.click(screen.getByText('Google Cloud'));
    });
    await waitFor(async () => {
      container.getElementsByTagName('form')[0].submit();
    });

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
    dependency.checkAccountHCS = jest.fn(() => new Promise((resolve) => resolve(hcsEnrollment)));
    createSource.doCreateSource = jest.fn(() => new Promise((_, reject) => reject('Error - wrong name')));

    const { container } = render(
      componentWrapperIntl(<AddSourceWizard {...initialProps} submitCallback={submitCallback} />, store),
    );

    await waitFor(() => expect(screen.getByText('Select cloud provider', { selector: 'button' })).toBeInTheDocument());

    await waitFor(async () => {
      await user.click(screen.getByText('Google Cloud'));
    });
    await waitFor(async () => {
      container.getElementsByTagName('form')[0].submit();
    });

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

    dependency.checkAccountHCS = jest.fn(() => new Promise((resolve) => resolve(hcsEnrollment)));
    const onClose = jest.fn();

    render(componentWrapperIntl(<AddSourceWizard {...initialProps} onClose={onClose} />, store));

    await waitFor(() => expect(screen.getByText('Select cloud provider', { selector: 'button' })).toBeInTheDocument());

    await waitFor(async () => {
      await user.click(screen.getByText('Google Cloud'));
    });
    await waitFor(async () => {
      await user.click(screen.getByLabelText('Close wizard'));
    });

    expect(screen.getByText('Cancel creating the integration?')).toBeInTheDocument();
    await waitFor(async () => {
      await user.click(screen.getByText('Cancel', { selector: '#on-exit-button' }));
    });
    expect(onClose).toHaveBeenCalledWith({ source_type: GOOGLE_NAME });
  });

  it('stay on the wizard', async () => {
    const user = userEvent.setup();

    dependency.checkAccountHCS = jest.fn(() => new Promise((resolve) => resolve(hcsEnrollment)));
    const onClose = jest.fn();

    render(componentWrapperIntl(<AddSourceWizard {...initialProps} onClose={onClose} />, store));

    await waitFor(() => expect(screen.getByText('Select cloud provider', { selector: 'button' })).toBeInTheDocument());

    await waitFor(async () => {
      await user.click(screen.getByText('Google Cloud'));
    });
    await waitFor(async () => {
      await user.click(screen.getByLabelText('Close wizard'));
    });
    await waitFor(async () => {
      await user.click(screen.getByText('Stay'));
    });

    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByText('Google Cloud').closest('.pf-m-selected')).toBeInTheDocument();
  });

  it('show error step after failing the form', async () => {
    const user = userEvent.setup();

    const ERROR_MESSAGE = 'fail';
    dependency.checkAccountHCS = jest.fn(() => new Promise((resolve) => resolve(hcsEnrollment)));
    createSource.doCreateSource = jest.fn(() => new Promise((_resolve, reject) => reject(ERROR_MESSAGE)));

    const { container } = render(componentWrapperIntl(<AddSourceWizard {...initialProps} />, store));

    await waitFor(() => expect(screen.getByText('Select cloud provider', { selector: 'button' })).toBeInTheDocument());

    await waitFor(async () => {
      await user.click(screen.getByText('Google Cloud'));
    });
    await waitFor(async () => {
      container.getElementsByTagName('form')[0].submit();
    });

    await waitFor(() => expect(() => screen.getByText('Validating credentials')).toThrow());

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(
      screen.getByText(
        'There was a problem while trying to add your source. Please try again. If the error persists, open a support case.',
      ),
    ).toBeInTheDocument();
  });

  it('afterError closes wizard with no values', async () => {
    const user = userEvent.setup();

    const closeCallback = jest.fn();

    dependency.checkAccountHCS = jest.fn(() => new Promise((resolve) => resolve(hcsEnrollment)));
    createSource.doCreateSource = jest.fn(() => Promise.reject('error'));

    const { container } = render(componentWrapperIntl(<AddSourceWizard {...initialProps} onClose={closeCallback} />, store));

    await waitFor(() => expect(screen.getByText('Select cloud provider', { selector: 'button' })).toBeInTheDocument());

    await waitFor(async () => {
      await user.click(screen.getByText('Google Cloud'));
    });
    await waitFor(async () => {
      container.getElementsByTagName('form')[0].submit();
    });

    await waitFor(() => expect(() => screen.getByText('Validating credentials')).toThrow());

    expect(closeCallback).not.toHaveBeenCalled();

    await waitFor(async () => {
      await user.click(screen.getByLabelText('Close'));
    });

    expect(closeCallback).toHaveBeenCalledWith({});
  });

  it('afterSubmit closes wizard with values', async () => {
    const user = userEvent.setup();

    const closeCallback = jest.fn();

    dependency.checkAccountHCS = jest.fn(() => new Promise((resolve) => resolve(hcsEnrollment)));
    createSource.doCreateSource = jest.fn(() => Promise.resolve(SOURCE_DATA_OUT));

    const { container } = render(componentWrapperIntl(<AddSourceWizard {...initialProps} onClose={closeCallback} />, store));

    await waitFor(() => expect(screen.getByText('Select cloud provider', { selector: 'button' })).toBeInTheDocument());

    await waitFor(async () => {
      await user.click(screen.getByText('Google Cloud'));
    });
    await waitFor(async () => {
      container.getElementsByTagName('form')[0].submit();
    });

    await waitFor(() => expect(() => screen.getByText('Validating credentials')).toThrow());

    expect(closeCallback).not.toHaveBeenCalled();

    await waitFor(async () => {
      await user.click(screen.getByLabelText('Close'));
    });

    await waitFor(() => expect(closeCallback).toHaveBeenCalledWith(undefined, SOURCE_DATA_OUT));
  });

  it('reset - resets initialValues', async () => {
    const user = userEvent.setup();

    dependency.checkAccountHCS = jest.fn(() => new Promise((resolve) => resolve(hcsEnrollment)));
    createSource.doCreateSource = jest.fn(() => Promise.resolve(SOURCE_DATA_OUT));

    const { container } = render(componentWrapperIntl(<AddSourceWizard {...initialProps} />, store));

    await waitFor(() => expect(screen.getByText('Select cloud provider', { selector: 'button' })).toBeInTheDocument());

    await act(async () => {
      await user.click(screen.getByText('Google Cloud'));
    });
    await waitFor(async () => {
      container.getElementsByTagName('form')[0].submit();
    });

    await waitFor(() => expect(() => screen.getByText('Validating credentials')).toThrow());

    await act(async () => {
      await user.click(screen.getByText('Add another integration'));
    });

    expect(screen.getByText('Google Cloud').closest('.pf-m-selected')).toBeNull();
  });

  it('tryAgain retries the request', async () => {
    dependency.checkAccountHCS = jest.fn(() => new Promise((resolve) => resolve(hcsEnrollment)));
    const user = userEvent.setup();

    createSource.doCreateSource = jest.fn(() => Promise.reject('error'));

    const { container } = render(componentWrapperIntl(<AddSourceWizard {...initialProps} />, store));

    await waitFor(() => expect(screen.getByText('Select cloud provider', { selector: 'button' })).toBeInTheDocument());

    await waitFor(async () => {
      await user.click(screen.getByText('Google Cloud'));
    });
    await waitFor(async () => {
      container.getElementsByTagName('form')[0].submit();
    });

    await waitFor(() => expect(() => screen.getByText('Validating credentials')).toThrow());
    createSource.doCreateSource.mockClear();
    expect(createSource.doCreateSource).not.toHaveBeenCalled();
    await waitFor(async () => {
      await user.click(screen.getByText('Retry'));
    });

    await waitFor(() =>
      expect(createSource.doCreateSource).toHaveBeenCalledWith(
        {
          application: {
            extra: {
              hcs: false,
            },
          },
          source_type: GOOGLE_NAME,
        },
        expect.any(Array),
        applicationTypes,
      ),
    );
  });

  describe('different variants', () => {
    const getNavigation = (container) =>
      [...container.parentElement.getElementsByClassName('pf-v5-c-wizard__nav-item')].map((item) => item.textContent);

    it('show configuration step when selectedType is set - CLOUD', async () => {
      dependency.checkAccountHCS = jest.fn(() => new Promise((resolve) => resolve(hcsEnrollment)));
      const { container } = render(
        componentWrapperIntl(<AddSourceWizard {...initialProps} selectedType="amazon" activeCategory={CLOUD_VENDOR} />, store),
      );

      await waitFor(() => expect(screen.getByText('Name integration', { selector: 'button' })).toBeInTheDocument());

      expect(getNavigation(container)).toEqual(['Name integration', 'Select configuration']);
    });

    it('show source type selection when CLOUD', async () => {
      dependency.checkAccountHCS = jest.fn(() => new Promise((resolve) => resolve(hcsEnrollment)));
      const { container } = render(
        componentWrapperIntl(
          <AddSourceWizard {...initialProps} initialValues={{ source_type: 'amazon' }} activeCategory={CLOUD_VENDOR} />,
          store,
        ),
      );

      await waitFor(() => expect(screen.getByText('Name integration', { selector: 'button' })).toBeInTheDocument());

      expect(getNavigation(container)).toEqual(['Select cloud provider', 'Name integration', 'Select configuration']);
    });

    it('show application step when selectedType is set and configuration is selected to true', async () => {
      dependency.checkAccountHCS = jest.fn(() => new Promise((resolve) => resolve(hcsEnrollment)));
      const { container } = render(
        componentWrapperIntl(
          <AddSourceWizard
            {...initialProps}
            selectedType="amazon"
            initialValues={{ source: { app_creation_workflow: ACCOUNT_AUTHORIZATION } }}
            activeCategory={CLOUD_VENDOR}
          />,
          store,
        ),
      );

      await waitFor(() => expect(screen.getByText('Name integration', { selector: 'button' })).toBeInTheDocument());

      expect(getNavigation(container)).toEqual([
        'Name integration',
        'Select configuration',
        'Select applications',
        'Review details',
      ]);
    });

    it('show application step when selectedType is set and configuration is selected to false', async () => {
      dependency.checkAccountHCS = jest.fn(() => new Promise((resolve) => resolve(hcsEnrollment)));
      const { container } = render(
        componentWrapperIntl(
          <AddSourceWizard
            {...initialProps}
            selectedType="amazon"
            initialValues={{ source: { app_creation_workflow: MANUAL_CONFIGURATION } }}
            activeCategory={CLOUD_VENDOR}
          />,
          store,
        ),
      );

      await waitFor(() => expect(screen.getByText('Name integration', { selector: 'button' })).toBeInTheDocument());

      expect(getNavigation(container)).toEqual(['Name integration', 'Select configuration', 'Select application', 'Credentials']);
    });

    it('show application step when selectedType is set - RED HAT', async () => {
      dependency.checkAccountHCS = jest.fn(() => new Promise((resolve) => resolve(hcsEnrollment)));
      const { container } = render(
        componentWrapperIntl(
          <AddSourceWizard {...initialProps} selectedType="openshift" activeCategory={REDHAT_VENDOR} />,
          store,
        ),
      );

      await waitFor(() => expect(screen.getByText('Name integration', { selector: 'button' })).toBeInTheDocument());

      expect(getNavigation(container)).toEqual([
        'Name integration',
        'Select application',
        'Credentials',
        'Configure OpenShift endpoint',
        'Review details',
      ]);
    });

    it('show source type selection when REDHAT', async () => {
      dependency.checkAccountHCS = jest.fn(() => new Promise((resolve) => resolve(hcsEnrollment)));
      const { container } = render(
        componentWrapperIntl(<AddSourceWizard {...initialProps} activeCategory={REDHAT_VENDOR} />, store),
      );

      await waitFor(() => expect(screen.getByText('Name integration', { selector: 'button' })).toBeInTheDocument());

      expect(getNavigation(container)).toEqual(['Integration type and application', 'Name integration']);
    });
  });

  it('pass initialWizardState to wizard', async () => {
    dependency.checkAccountHCS = jest.fn(() => new Promise((resolve) => resolve(hcsEnrollment)));
    await act(async () => {
      render(componentWrapperIntl(<AddSourceWizard {...initialProps} initialWizardState={{ activeStep: 'name_step' }} />, store));
    });

    await waitFor(() => expect(screen.getByText('Enter a name for your integration.')).toBeInTheDocument());
  });
});
