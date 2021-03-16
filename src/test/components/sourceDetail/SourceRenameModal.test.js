import React from 'react';

import { Modal } from '@patternfly/react-core';

import { act } from 'react-dom/test-utils';

import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import { MemoryRouter, Route } from 'react-router-dom';
import { replaceRouteId, routes } from '../../../Routes';
import SourceRenameModal from '../../../components/SourceDetail/SourceRenameModal';
import SourcesFormRenderer from '../../../utilities/SourcesFormRenderer';
import TextField from '@data-driven-forms/pf4-component-mapper/text-field';
import * as actions from '../../../redux/sources/actions';
import mockStore from '../../__mocks__/mockStore';

jest.mock('../../../components/addSourceWizard/SourceAddSchema', () => ({
  __esModule: true,
  asyncValidatorDebounced: jest.fn(),
}));

describe('SourceRenameModal', () => {
  let wrapper;
  let store;

  const sourceId = '3627987';
  const initialEntry = [replaceRouteId(routes.sourcesDetailRename.path, sourceId)];

  beforeEach(() => {
    store = mockStore({
      sources: {
        entities: [
          {
            id: sourceId,
            name: 'old-name',
          },
        ],
      },
    });

    wrapper = mount(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <SourceRenameModal {...args} />} />,
        store,
        initialEntry
      )
    );
  });

  it('renders correctly', () => {
    expect(wrapper.find(Modal)).toHaveLength(1);
    expect(wrapper.find(Modal).props().title).toEqual('Rename source');
    expect(wrapper.find(Modal).props().description).toEqual('Enter a new name for your source.');

    expect(wrapper.find(SourcesFormRenderer)).toHaveLength(1);
    expect(wrapper.find(TextField)).toHaveLength(1);
  });

  it('close on close icon', async () => {
    await act(async () => {
      wrapper.find(Modal).find('button').first().simulate('click');
    });
    wrapper.update();

    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(
      replaceRouteId(routes.sourcesDetail.path, sourceId)
    );
  });

  it('close on cancel', async () => {
    await act(async () => {
      wrapper.find(Modal).find('button').first().simulate('click');
    });
    wrapper.update();

    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(
      replaceRouteId(routes.sourcesDetail.path, sourceId)
    );
  });

  it('submits', async () => {
    actions.renameSource = jest.fn().mockImplementation(() => ({ type: 'something' }));

    await act(async () => {
      const sourceRefInput = wrapper.find('input[name="name"]');
      sourceRefInput.instance().value = 'new-name';
      sourceRefInput.simulate('change');
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('form').simulate('submit');
    });
    wrapper.update();

    expect(actions.renameSource).toHaveBeenCalledWith(sourceId, 'new-name', 'Renaming was unsuccessful');

    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(
      replaceRouteId(routes.sourcesDetail.path, sourceId)
    );
  });
});
