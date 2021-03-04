import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { act } from 'react-dom/test-utils';

import { Modal } from '@patternfly/react-core/dist/esm/components/Modal';
import { Spinner } from '@patternfly/react-core/dist/esm/components/Spinner';
import { Bullseye } from '@patternfly/react-core/dist/esm/layouts/Bullseye';
import { Button } from '@patternfly/react-core/dist/esm/components/Button/Button';

import { replaceRouteId, routes } from '../../../Routes';
import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import sourceTypesData, { AMAZON, AMAZON_ID } from '../../__mocks__/sourceTypesData';
import mockStore from '../../__mocks__/mockStore';
import SourcesFormRenderer from '../../../utilities/SourcesFormRenderer';
import CredentialsForm from '../../../components/CredentialsForm/CredentialsForm';

import * as api from '../../../api/entities';
import * as actions from '../../../redux/sources/actions';
import ModalFormTemplate from '../../../components/CredentialsForm/ModalFormTemplate';
import generateSuperKeyFields from '../../../addSourceWizard/addSourceWizard/superKey/generateSuperKeyFields';

describe('CredentialsForm', () => {
  let wrapper;
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
    listSourceAuthentications = jest
      .fn()
      .mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve(authentications), 100)));

    api.getSourcesApi = () => ({
      listSourceAuthentications,
    });

    jest.useFakeTimers();

    await act(async () => {
      wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesDetailEditCredentials.path} render={(...args) => <CredentialsForm {...args} />} />,
          store,
          initialEntry
        )
      );
    });
    wrapper.update();

    expect(wrapper.find(Modal).props().title).toEqual('Edit account authorization credentials');
    expect(wrapper.find(Bullseye)).toHaveLength(1);
    expect(wrapper.find(Spinner)).toHaveLength(1);
    expect(wrapper.find(SourcesFormRenderer)).toHaveLength(0);

    await act(async () => {
      jest.runAllTimers();
    });
    wrapper.update();

    expect(wrapper.find(Spinner)).toHaveLength(0);
    expect(wrapper.find(Bullseye)).toHaveLength(0);
    expect(wrapper.find(Modal).props().title).toEqual('Edit account authorization credentials');
    expect(wrapper.find(Modal).props().description).toEqual(
      'Use the fields below to reset your account authorization credentials. It may take some time to validate new information.'
    );
    expect(wrapper.find(Modal).props().isOpen).toEqual(true);
    expect(wrapper.find(ModalFormTemplate)).toHaveLength(1);
    expect(wrapper.find(SourcesFormRenderer).props().initialValues).toEqual({ authentication: authentications.data[1] });
    expect(wrapper.find(SourcesFormRenderer).props().schema).toEqual({
      fields: [generateSuperKeyFields(sourceTypesData.data, AMAZON.name)],
    });
  });

  it('closes via cross icon', async () => {
    await act(async () => {
      wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesDetailEditCredentials.path} render={(...args) => <CredentialsForm {...args} />} />,
          store,
          initialEntry
        )
      );
    });
    wrapper.update();

    await act(async () => {
      wrapper.find(Button).first().simulate('click');
    });
    wrapper.update();

    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(
      replaceRouteId(routes.sourcesDetail.path, sourceId)
    );
  });

  it('closes via cancel button', async () => {
    await act(async () => {
      wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesDetailEditCredentials.path} render={(...args) => <CredentialsForm {...args} />} />,
          store,
          initialEntry
        )
      );
    });
    wrapper.update();

    await act(async () => {
      wrapper.find(Button).last().simulate('click');
    });
    wrapper.update();

    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(
      replaceRouteId(routes.sourcesDetail.path, sourceId)
    );
  });

  it('submit - success', async () => {
    const updateAuthentication = jest.fn().mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve(), 100)));

    api.getSourcesApi = () => ({
      listSourceAuthentications,
      updateAuthentication,
    });

    actions.addMessage = jest.fn().mockImplementation(() => ({ type: 'nonsense' }));

    await act(async () => {
      wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesDetailEditCredentials.path} render={(...args) => <CredentialsForm {...args} />} />,
          store,
          initialEntry
        )
      );
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('input[name="authentication.username"]').instance().value = 'newname';
      wrapper.find('input[name="authentication.username"]').simulate('change');
    });
    wrapper.update();

    expect(updateAuthentication).not.toHaveBeenCalled();
    expect(actions.addMessage).not.toHaveBeenCalled();

    jest.useFakeTimers();

    await act(async () => {
      wrapper.find('form').simulate('submit');
    });
    wrapper.update();

    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(
      replaceRouteId(routes.sourcesDetail.path, sourceId)
    );
    expect(updateAuthentication).toHaveBeenCalledWith('auth-id', { username: 'newname' });
    expect(actions.addMessage).not.toHaveBeenCalled();

    await act(async () => {
      jest.runAllTimers();
    });
    wrapper.update();

    expect(actions.addMessage).toHaveBeenCalledWith({
      description: 'It may take some time to validate your new credentials. Check this page for status updates.',
      title: 'New credentials saved',
      variant: 'info',
    });
  });

  it('submit - fail', async () => {
    const updateAuthentication = jest
      .fn()
      .mockImplementation(() => new Promise((resolve, reject) => setTimeout(() => reject(), 100)));

    api.getSourcesApi = () => ({
      listSourceAuthentications,
      updateAuthentication,
    });

    actions.addMessage = jest.fn().mockImplementation(() => ({ type: 'nonsense' }));

    await act(async () => {
      wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesDetailEditCredentials.path} render={(...args) => <CredentialsForm {...args} />} />,
          store,
          initialEntry
        )
      );
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('input[name="authentication.username"]').instance().value = 'newname';
      wrapper.find('input[name="authentication.username"]').simulate('change');
    });
    wrapper.update();

    expect(updateAuthentication).not.toHaveBeenCalled();
    expect(actions.addMessage).not.toHaveBeenCalled();

    jest.useFakeTimers();

    await act(async () => {
      wrapper.find('form').simulate('submit');
    });
    wrapper.update();

    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(
      replaceRouteId(routes.sourcesDetail.path, sourceId)
    );
    expect(updateAuthentication).toHaveBeenCalledWith('auth-id', { username: 'newname' });
    expect(actions.addMessage).not.toHaveBeenCalled();

    await act(async () => {
      jest.runAllTimers();
    });
    wrapper.update();

    expect(actions.addMessage).toHaveBeenCalledWith({
      description:
        'There was a problem while trying to update credentials. Please try again. If the error persists, open a support case.',
      title: 'Error updating credentials',
      variant: 'danger',
    });
  });
});
