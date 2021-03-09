import React from 'react';

import { Button } from '@patternfly/react-core/dist/esm/components/Button/Button';
import { Modal } from '@patternfly/react-core/dist/esm/components/Modal/Modal';
import { Title } from '@patternfly/react-core/dist/esm/components/Title/Title';

import ExclamationTriangleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';

import mount from '../addSourceWizard/__mocks__/mount';
import CloseModal from '../../components/CloseModal';

describe('CloseModal', () => {
  let initialProps;
  let onExit;
  let onStay;
  let isOpen;

  beforeEach(() => {
    onExit = jest.fn();
    onStay = jest.fn();
    isOpen = true;

    initialProps = {
      onExit,
      onStay,
      isOpen,
    };
  });

  it('renders correctly', () => {
    const wrapper = mount(<CloseModal {...initialProps} />);

    expect(wrapper.find(Modal)).toHaveLength(1);
    expect(wrapper.find(Button)).toHaveLength(3);
    expect(wrapper.find(ExclamationTriangleIcon)).toHaveLength(1);
    expect(wrapper.find(Title)).toHaveLength(1);
  });

  it('renders correctly with custom title', () => {
    initialProps = {
      ...initialProps,
      title: 'CUSTOM TITLE',
    };

    const wrapper = mount(<CloseModal {...initialProps} />);

    expect(wrapper.find(Modal)).toHaveLength(1);
    expect(wrapper.find(Button)).toHaveLength(3);
    expect(wrapper.find(ExclamationTriangleIcon)).toHaveLength(1);
    expect(wrapper.find(Title).text()).toEqual(initialProps.title);
  });

  it('calls onExit', () => {
    const wrapper = mount(<CloseModal {...initialProps} />);

    wrapper.find(Button).at(1).simulate('click');

    expect(onExit).toHaveBeenCalled();
  });

  it('calls onStay', () => {
    const wrapper = mount(<CloseModal {...initialProps} />);

    wrapper.find(Button).at(0).simulate('click');

    expect(onStay).toHaveBeenCalled();
    onStay.mockClear();

    wrapper.find(Button).at(2).simulate('click');

    expect(onStay).toHaveBeenCalled();
    onStay.mockClear();
  });

  it('calls onStay when pressed escape second time', () => {
    const wrapper = mount(<CloseModal {...initialProps} />);

    wrapper.find(Modal).at(0).props().onEscapePress();

    expect(onStay).not.toHaveBeenCalled();

    wrapper.find(Modal).at(0).props().onEscapePress();

    expect(onStay).toHaveBeenCalled();
  });
});
