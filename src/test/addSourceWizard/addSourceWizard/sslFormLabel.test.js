import React from 'react';

import { Popover } from '@patternfly/react-core/dist/esm/components/Popover/Popover';

import QuestionCircleIcon from '@patternfly/react-icons/dist/esm/icons/question-circle-icon';

import SSLFormLabel from '../../../components/addSourceWizard/SSLFormLabel';
import mount from '../__mocks__/mount';

describe('SSLFormLabel', () => {
  it('renders loading step correctly', () => {
    const wrapper = mount(<SSLFormLabel />);
    expect(wrapper.find(Popover)).toHaveLength(1);
    expect(wrapper.find(QuestionCircleIcon)).toHaveLength(1);
  });
});
