import React from 'react';
import { act } from 'react-dom/test-utils';

import { AddSourceButton } from '../../../components/addSourceWizard/';
import sourceTypes from '../helpers/sourceTypes';
import applicationTypes from '../helpers/applicationTypes';
import Form from '../../../components/addSourceWizard/SourceAddModal';

import mount from '../__mocks__/mount';
import { CLOUD_VENDOR } from '../../../utilities/constants';

describe('AddSourceButton', () => {
  it('opens wizard and close wizard', async () => {
    let wrapper;

    await act(async () => {
      wrapper = mount(
        <AddSourceButton sourceTypes={sourceTypes} applicationTypes={applicationTypes} activeVendor={CLOUD_VENDOR} />
      );
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('button').simulate('click');
    });

    wrapper.update();

    expect(wrapper.find(Form).length).toBe(1);

    await act(async () => {
      wrapper.find('button.pf-c-wizard__close').simulate('click');
    });

    wrapper.update();

    expect(wrapper.find(Form).length).toBe(0);
  });
});
