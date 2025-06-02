import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import FinalWizard from '../../../components/addSourceWizard/FinalWizard';

import render from '../__mocks__/render';
import sourceTypes, { AMAZON_TYPE } from '../../__mocks__/sourceTypes';

import * as api from '../../../api/entities';
import { replaceRouteId, routes } from '../../../routes';

describe('Final wizard', () => {
  let initialProps;
  let id;

  beforeEach(() => {
    id = 'some-id';
    initialProps = {
      afterSubmit: jest.fn(),
      afterError: jest.fn(),
      isFinished: false,
      isErrored: false,
      successfulMessage: 'Message',
      hideSourcesButton: false,
      returnButtonTitle: 'Go back to my application',
      reset: jest.fn(),
      createdSource: {
        id,
        applications: [],
      },
      sourceTypes,
    };
  });

  it('contains loading step', () => {
    render(<FinalWizard {...initialProps} />);

    expect(screen.getByText('Validating credentials')).toBeInTheDocument();
    expect(
      screen.getByText(
        "This might take some time. You'll receive a notification if you are still in the Integrations application when the process completes. Otherwise, you can check the status in the main integrations table at any time.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('In the meantime, you can close this window while the validation process continues.'),
    ).toBeInTheDocument();
  });

  it('renders amazon finished step correctly', () => {
    render(
      <FinalWizard
        {...initialProps}
        createdSource={{
          id,
          source_type_id: AMAZON_TYPE.id,
          applications: [],
        }}
        isFinished={true}
      />,
    );

    expect(screen.getByText('Amazon Web Services connection established')).toBeInTheDocument();
  });

  it('renders finished step correctly', () => {
    render(<FinalWizard {...initialProps} isFinished={true} />);
    expect(screen.getByText('Configuration successful')).toBeInTheDocument();
  });

  it('renders finished step correctly with default props', () => {
    // eslint-disable-next-line no-unused-vars
    const { createdSource, ...rest } = initialProps;

    render(<FinalWizard {...rest} isFinished={true} />);
    expect(screen.getByText('Configuration successful')).toBeInTheDocument();
  });

  it('calls reset', async () => {
    const user = userEvent.setup();

    render(<FinalWizard {...initialProps} isFinished={true} hideSourcesButton={true} />);

    await waitFor(async () => {
      await user.click(screen.getByText('Add another integration'));
    });

    expect(initialProps.reset).toHaveBeenCalled();
  });

  it('renders errored step correctly', () => {
    render(<FinalWizard {...initialProps} isErrored={true} />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
    expect(screen.getByText('Open a support case')).toBeInTheDocument();
  });

  it('retries to create source on errored', async () => {
    const user = userEvent.setup();

    const tryAgain = jest.fn();

    render(<FinalWizard {...initialProps} isErrored={true} tryAgain={tryAgain} />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    expect(tryAgain).not.toHaveBeenCalled();

    await waitFor(async () => {
      await user.click(screen.getByText('Retry'));
    });

    expect(tryAgain).toHaveBeenCalled();
  });

  it('removes source on errored step correctly - when unavailable', async () => {
    const user = userEvent.setup();

    const ERROR_MSG = 'Some error message';
    const deleteSource = jest.fn().mockImplementation(() => Promise.resolve());

    api.getSourcesApi = () => ({
      deleteSource,
    });

    render(
      <FinalWizard
        {...initialProps}
        isFinished={true}
        createdSource={{
          id,
          applications: [
            {
              availability_status: 'unavailable',
              availability_status_error: ERROR_MSG,
            },
          ],
        }}
      />,
    );

    expect(screen.getByText('Configuration unsuccessful')).toBeInTheDocument();
    expect(screen.getByText(ERROR_MSG)).toBeInTheDocument();

    await waitFor(async () => {
      await user.click(screen.getByText('Remove integration'));
    });
    await waitFor(() => expect(deleteSource).toHaveBeenCalledWith(id));

    expect(screen.getByText('Removing successful')).toBeInTheDocument();
  });

  it('removes source on errored step correctly with afterSucces - when unavailable', async () => {
    const user = userEvent.setup();

    const ERROR_MSG = 'Some error message';
    const deleteSource = jest.fn().mockImplementation(() => Promise.resolve());
    const afterSuccess = jest.fn();

    api.getSourcesApi = () => ({
      deleteSource,
    });

    render(
      <FinalWizard
        {...initialProps}
        afterSuccess={afterSuccess}
        isFinished={true}
        createdSource={{
          id,
          applications: [
            {
              availability_status: 'unavailable',
              availability_status_error: ERROR_MSG,
            },
          ],
        }}
      />,
    );

    expect(screen.getByText('Configuration unsuccessful')).toBeInTheDocument();
    expect(screen.getByText(ERROR_MSG)).toBeInTheDocument();

    await waitFor(async () => {
      await user.click(screen.getByText('Remove integration'));
    });

    await waitFor(() => expect(deleteSource).toHaveBeenCalledWith(id));
    expect(afterSuccess).toHaveBeenCalled();
  });

  it('removes source on errored step correctly, restart when removing failed', async () => {
    const user = userEvent.setup();

    const ERROR_MSG = 'Some error message';
    const deleteSource = jest.fn().mockImplementation(() => Promise.reject());

    api.getSourcesApi = () => ({
      deleteSource,
    });

    render(
      <FinalWizard
        {...initialProps}
        isFinished={true}
        createdSource={{
          id,
          applications: [
            {
              availability_status: 'unavailable',
              availability_status_error: ERROR_MSG,
            },
          ],
        }}
      />,
    );

    expect(screen.getByText('Configuration unsuccessful')).toBeInTheDocument();
    expect(screen.getByText(ERROR_MSG)).toBeInTheDocument();

    await waitFor(async () => {
      await user.click(screen.getByText('Remove integration'));
    });

    await waitFor(() => expect(deleteSource).toHaveBeenCalledWith(id));

    expect(screen.getByText('Configuration unsuccessful')).toBeInTheDocument();
    expect(screen.getByText(ERROR_MSG)).toBeInTheDocument();
  });

  it('when configuration failed, go to edit', async () => {
    const user = userEvent.setup();

    const ERROR_MSG = 'Some error message';

    render(
      <FinalWizard
        {...initialProps}
        isFinished={true}
        createdSource={{
          id,
          applications: [
            {
              availability_status: 'unavailable',
              availability_status_error: ERROR_MSG,
            },
          ],
        }}
      />,
    );

    expect(screen.getByText('Configuration unsuccessful')).toBeInTheDocument();
    expect(screen.getByText(ERROR_MSG)).toBeInTheDocument();

    await waitFor(async () => {
      await user.click(screen.getByText('Edit integration'));
    });

    expect(screen.getByTestId('location-display').textContent).toEqual(
      replaceRouteId(`/settings/integrations/${routes.sourcesDetail.path}`, id),
    );
  });

  it('when configuration failed, show endpoint error', async () => {
    const ERROR_MSG = 'Some error message';

    render(
      <FinalWizard
        {...initialProps}
        isFinished={true}
        createdSource={{
          id,
          endpoint: [
            {
              availability_status: 'unavailable',
              availability_status_error: ERROR_MSG,
            },
          ],
        }}
      />,
    );

    expect(screen.getByText('Configuration unsuccessful')).toBeInTheDocument();
    expect(screen.getByText(ERROR_MSG)).toBeInTheDocument();
  });

  it('shows timeouted step', async () => {
    render(
      <FinalWizard
        {...initialProps}
        isFinished={true}
        createdSource={{
          id,
          applications: [
            {
              availability_status: null,
            },
          ],
        }}
      />,
    );

    expect(screen.getByText('Configuration in progress')).toBeInTheDocument();
  });

  it('shows successful step', async () => {
    render(
      <FinalWizard
        {...initialProps}
        isFinished={true}
        createdSource={{
          id,
          applications: [
            {
              availability_status: 'available',
            },
          ],
        }}
      />,
    );

    expect(screen.getByText('Configuration successful')).toBeInTheDocument();
  });
});
