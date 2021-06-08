import React from 'react';
import { act } from 'react-dom/test-utils';

import { Button } from '@patternfly/react-core';

import AddSourceWizard from '../../../components/addSourceWizard/SourceAddModal';
import sourceTypes from '../helpers/sourceTypes';
import applicationTypes from '../helpers/applicationTypes';

import * as dependency from '../../../api/wizardHelpers';
import mount from '../__mocks__/mount';
import SourcesFormRenderer from '../../../utilities/SourcesFormRenderer';
import LoadingStep from '../../../components/steps/LoadingStep';

describe('sourceAddModal', () => {
  let initialProps;
  let spyFunction;
  let wrapper;

  beforeEach(() => {
    spyFunction = jest.fn();

    initialProps = {
      isOpen: true,
      refreshSources: spyFunction,
      onCancel: jest.fn(),
      onSubmit: jest.fn(),
    };
  });

  it('renders correctly with sourceTypes and applicationTypes', async () => {
    await act(async () => {
      wrapper = mount(<AddSourceWizard {...initialProps} sourceTypes={sourceTypes} applicationTypes={applicationTypes} />);
    });
    wrapper.update();
    expect(wrapper.find(SourcesFormRenderer)).toHaveLength(1);
  });

  it('renders correctly without sourceTypes', async () => {
    // mock API
    dependency.doLoadApplicationTypes = jest.fn(() => new Promise((resolve) => resolve({ applicationTypes })));
    dependency.doLoadSourceTypes = jest.fn(() => new Promise((resolve) => resolve({ sourceTypes })));

    await act(async () => {
      wrapper = mount(<AddSourceWizard {...initialProps} applicationTypes={applicationTypes} />);
    });
    wrapper.update();

    expect(dependency.doLoadSourceTypes).toHaveBeenCalled();
    expect(dependency.doLoadApplicationTypes).not.toHaveBeenCalled();
    expect(wrapper.find(SourcesFormRenderer)).toHaveLength(1);
  });

  it('renders correctly without applicationTypes', async () => {
    // mock API
    dependency.doLoadSourceTypes = jest.fn(() => new Promise((resolve) => resolve({ sourceTypes })));
    dependency.doLoadApplicationTypes = jest.fn(() => new Promise((resolve) => resolve({ applicationTypes })));

    await act(async () => {
      wrapper = mount(<AddSourceWizard {...initialProps} sourceTypes={sourceTypes} />);
    });
    wrapper.update();

    expect(dependency.doLoadSourceTypes).not.toHaveBeenCalled();
    expect(dependency.doLoadApplicationTypes).toHaveBeenCalled();
    expect(wrapper.find(SourcesFormRenderer)).toHaveLength(1);
  });

  it('renders correctly without sourceTypes and application types', async () => {
    // mock API
    dependency.doLoadSourceTypes = jest.fn(() => new Promise((resolve) => resolve({ sourceTypes })));
    dependency.doLoadApplicationTypes = jest.fn(() => new Promise((resolve) => resolve({ applicationTypes })));

    await act(async () => {
      wrapper = mount(<AddSourceWizard {...initialProps} />);
    });
    wrapper.update();

    expect(dependency.doLoadSourceTypes).toHaveBeenCalled();
    expect(dependency.doLoadApplicationTypes).toHaveBeenCalled();
    expect(wrapper.find(SourcesFormRenderer)).toHaveLength(1);
  });

  it('clicks on onCancel when loading', async () => {
    jest.useFakeTimers();

    const onCancel = jest.fn();

    dependency.doLoadSourceTypes = jest
      .fn()
      .mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve({ sourceTypes }), 100)));
    dependency.doLoadApplicationTypes = jest
      .fn()
      .mockImplementation(() => new Promise((resolve) => resolve({ applicationTypes })));

    await act(async () => {
      wrapper = mount(<AddSourceWizard {...initialProps} onCancel={onCancel} />);
    });
    wrapper.update();

    expect(wrapper.find(LoadingStep)).toHaveLength(1);

    expect(onCancel).not.toHaveBeenCalled();

    await act(async () => {
      wrapper.find(Button).at(1).simulate('click');
    });
    wrapper.update();

    expect(onCancel).toHaveBeenCalledWith();

    await act(async () => {
      jest.runAllTimers();
    });
    wrapper.update();

    expect(wrapper.find(LoadingStep)).toHaveLength(0);

    jest.useRealTimers();
  });
});
