import React from 'react';
import { act } from 'react-dom/test-utils';

import { Card, Tile } from '@patternfly/react-core';

import componentWrapperIntl from '../../utilities/testsHelpers';
import CloudEmptyState from '../../components/CloudEmptyState';
import { MemoryRouter } from 'react-router-dom';
import { routes } from '../../Routes';

describe('CloudEmptyState', () => {
  let wrapper;
  let setSelectedType;
  let initialProps;

  beforeEach(() => {
    setSelectedType = jest.fn();

    initialProps = {
      setSelectedType,
    };
  });

  it('renders correctly and sets local storage', async () => {
    await act(async () => {
      wrapper = mount(componentWrapperIntl(<CloudEmptyState {...initialProps} />));
    });
    wrapper.update();

    expect(wrapper.find(Card)).toHaveLength(1);
    expect(wrapper.find(Tile)).toHaveLength(3);
    expect(wrapper.find('img')).toHaveLength(3);
    expect(wrapper.find(Tile).last().props().isDisabled).toEqual(true);
  });

  it('sets amazon', async () => {
    await act(async () => {
      wrapper = mount(componentWrapperIntl(<CloudEmptyState {...initialProps} />));
    });
    wrapper.update();

    await act(async () => {
      wrapper.find(Tile).first().simulate('click');
    });
    wrapper.update();

    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(routes.sourcesNew.path);
    expect(setSelectedType).toHaveBeenCalledWith('amazon');
  });

  it('sets azure', async () => {
    await act(async () => {
      wrapper = mount(componentWrapperIntl(<CloudEmptyState {...initialProps} />));
    });
    wrapper.update();

    await act(async () => {
      wrapper.find(Tile).at(1).simulate('click');
    });
    wrapper.update();

    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(routes.sourcesNew.path);
    expect(setSelectedType).toHaveBeenCalledWith('azure');
  });

  it('does not set gcp', async () => {
    await act(async () => {
      wrapper = mount(componentWrapperIntl(<CloudEmptyState {...initialProps} />));
    });
    wrapper.update();

    await act(async () => {
      wrapper.find(Tile).last().simulate('click');
    });
    wrapper.update();

    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual('/');
    expect(setSelectedType).not.toHaveBeenCalled();
  });
});
