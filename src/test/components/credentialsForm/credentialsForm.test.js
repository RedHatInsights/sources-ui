import React from 'react';
import { Route } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { replaceRouteId, routes } from '../../../Routes';
import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import sourceTypesData, { AMAZON_ID } from '../../__mocks__/sourceTypesData';
import mockStore from '../../__mocks__/mockStore';
import CredentialsForm from '../../../components/CredentialsForm/CredentialsForm';

import * as api from '../../../api/entities';
import * as actions from '../../../redux/sources/actions';

describe('CredentialsForm', () => {
  let store;

  const sourceId = '3627987';
  const initialEntry = [replaceRouteId(routes.sourcesDetailEditCredentials.path, sourceId)];

  let listSourceAuthentications;

  const authentications = {
    data: [
      {
        authtype: 'nonsuperkey',
        username: 'do-not-use-me',
      },
      {
        authtype: 'access_key_secret_key',
        username: 'some-username',
        id: 'auth-id',
      },
    ],
  };

  beforeEach(() => {
    listSourceAuthentications = jest.fn().mockImplementation(() => Promise.resolve(authentications));

    api.getSourcesApi = () => ({
      listSourceAuthentications,
    });

    store = mockStore({
      sources: {
        entities: [{ id: sourceId, source_type_id: AMAZON_ID }],
        sourceTypes: sourceTypesData.data,
      },
    });
  });

  it('renders', async () => {
    listSourceAuthentications = jest.fn().mockResolvedValue(authentications);

    api.getSourcesApi = () => ({
      listSourceAuthentications,
    });
    render(
      componentWrapperIntl(
        <Route path={routes.sourcesDetailEditCredentials.path} render={(...args) => <CredentialsForm {...args} />} />,
        store,
        initialEntry
      )
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText('Edit account authorization credentials')).toBeInTheDocument();

    await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());

    expect(screen.getByText('Edit account authorization credentials')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Use the fields below to reset your account authorization credentials. It may take some time to validate new information.'
      )
    ).toBeInTheDocument();

    expect([...screen.getAllByRole('textbox')].map((e) => e.name || e.getAttribute('aria-label'))).toEqual([
      'authentication.username',
      'Filled password',
    ]);
  });

  it('renders when paused', async () => {
    listSourceAuthentications = jest.fn().mockImplementation(() => Promise.resolve(authentications));

    api.getSourcesApi = () => ({
      listSourceAuthentications,
    });

    store = mockStore({
      sources: {
        entities: [{ id: sourceId, source_type_id: AMAZON_ID, paused_at: 'today' }],
        sourceTypes: sourceTypesData.data,
      },
    });

    render(
      componentWrapperIntl(
        <Route path={routes.sourcesDetailEditCredentials.path} render={(...args) => <CredentialsForm {...args} />} />,
        store,
        initialEntry
      )
    );

    await waitFor(() => expect(screen.getByText('View account authorization credentials')).toBeInTheDocument());

    expect([...screen.getAllByRole('textbox')].every((e) => e.disabled)).toEqual(true);
  });

  it('closes via cross icon', async () => {
    render(
      componentWrapperIntl(
        <Route path={routes.sourcesDetailEditCredentials.path} render={(...args) => <CredentialsForm {...args} />} />,
        store,
        initialEntry
      )
    );

    await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());

    await userEvent.click(screen.getByLabelText('Close'));

    expect(screen.getByTestId('location-display').textContent).toEqual(replaceRouteId(routes.sourcesDetail.path, sourceId));
  });

  it('closes via cancel button', async () => {
    render(
      componentWrapperIntl(
        <Route path={routes.sourcesDetailEditCredentials.path} render={(...args) => <CredentialsForm {...args} />} />,
        store,
        initialEntry
      )
    );

    await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());

    await userEvent.click(screen.getByText('Cancel'));

    expect(screen.getByTestId('location-display').textContent).toEqual(replaceRouteId(routes.sourcesDetail.path, sourceId));
  });

  it('submit - success', async () => {
    const updateAuthentication = mockApi();

    api.getSourcesApi = () => ({
      listSourceAuthentications,
      updateAuthentication,
    });

    actions.addMessage = jest.fn().mockImplementation(() => ({ type: 'nonsense' }));

    render(
      componentWrapperIntl(
        <Route path={routes.sourcesDetailEditCredentials.path} render={(...args) => <CredentialsForm {...args} />} />,
        store,
        initialEntry
      )
    );

    await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());

    await userEvent.clear(screen.getAllByRole('textbox')[0]);
    await userEvent.type(screen.getAllByRole('textbox')[0], 'newname');

    expect(updateAuthentication).not.toHaveBeenCalled();
    expect(actions.addMessage).not.toHaveBeenCalled();

    await userEvent.click(screen.getByText('Submit'));

    expect(screen.getByTestId('location-display').textContent).toEqual(replaceRouteId(routes.sourcesDetail.path, sourceId));
    expect(updateAuthentication).toHaveBeenCalledWith('auth-id', { username: 'newname' });
    expect(actions.addMessage).not.toHaveBeenCalled();

    updateAuthentication.resolve();

    await waitFor(() =>
      expect(actions.addMessage).toHaveBeenCalledWith({
        description: 'It may take some time to validate your new credentials. Check this page for status updates.',
        title: 'New credentials saved',
        variant: 'info',
      })
    );
  });

  it('submit - fail', async () => {
    const updateAuthentication = mockApi();

    api.getSourcesApi = () => ({
      listSourceAuthentications,
      updateAuthentication,
    });

    actions.addMessage = jest.fn().mockImplementation(() => ({ type: 'nonsense' }));

    render(
      componentWrapperIntl(
        <Route path={routes.sourcesDetailEditCredentials.path} render={(...args) => <CredentialsForm {...args} />} />,
        store,
        initialEntry
      )
    );
    await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());

    await userEvent.clear(screen.getAllByRole('textbox')[0]);
    await userEvent.type(screen.getAllByRole('textbox')[0], 'newname');

    expect(updateAuthentication).not.toHaveBeenCalled();
    expect(actions.addMessage).not.toHaveBeenCalled();

    await userEvent.click(screen.getByText('Submit'));

    expect(screen.getByTestId('location-display').textContent).toEqual(replaceRouteId(routes.sourcesDetail.path, sourceId));
    expect(updateAuthentication).toHaveBeenCalledWith('auth-id', { username: 'newname' });
    expect(actions.addMessage).not.toHaveBeenCalled();

    updateAuthentication.reject();

    await waitFor(() =>
      expect(actions.addMessage).toHaveBeenCalledWith({
        description:
          'There was a problem while trying to update credentials. Please try again. If the error persists, open a support case.',
        title: 'Error updating credentials',
        variant: 'danger',
      })
    );
  });
});
