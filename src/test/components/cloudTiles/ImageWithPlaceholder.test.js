import React from 'react';
import { act } from 'react-dom/test-utils';

import componentWrapperIntl from '../../../utilities/testsHelpers';
import { Loader } from '../../../components/SourcesTable/loaders';
import ImageWithPlaceholder from '../../../components/CloudTiles/ImageWithPlaceholder';

describe('ImageWithPlaceholder', () => {
  let wrapper;

  it('hides the loader on onLoad', async () => {
    await act(async () => {
      wrapper = mount(componentWrapperIntl(<ImageWithPlaceholder src="/some-picture.jpg" />));
    });
    wrapper.update();

    expect(wrapper.find(Loader)).toHaveLength(1);
    expect(wrapper.find('img').props().style.display).toEqual('none');

    await act(async () => {
      wrapper.find('img').simulate('load');
    });
    wrapper.update();

    expect(wrapper.find(Loader)).toHaveLength(0);
    expect(wrapper.find('img').props().style.display).toEqual('initial');
  });
});
