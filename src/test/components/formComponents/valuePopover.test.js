import React from 'react';

import { Button, Popover } from '@patternfly/react-core';

import mount from '../../addSourceWizard/__mocks__/mount';
import ValuePopover from '../../../components/FormComponents/ValuePopover';

describe('ValuePopover', () => {
  it('renders correctly', () => {
    const wrapper = mount(<ValuePopover label="Some label" value="Some value" />);

    expect(wrapper.find(Popover).props().bodyContent).toEqual('Some value');
    expect(wrapper.find(Popover).props().headerContent).toEqual('Some label');
    expect(wrapper.find(Button)).toHaveLength(1);
  });
});
