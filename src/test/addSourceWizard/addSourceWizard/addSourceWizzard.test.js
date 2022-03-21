import React from 'react';
import { act } from 'react-dom/test-utils';

import { AddSourceWizard } from '../../../components/addSourceWizard/index';
import Form from '../../../components/addSourceWizard/SourceAddModal';
import Modal from '../../../components/addSourceWizard/SourceAddModal';
import FinalWizard from '../../../components/addSourceWizard/FinalWizard';

import sourceTypes from '../helpers/sourceTypes';
import applicationTypes from '../helpers/applicationTypes';
import * as dependency from '../../../api/wizardHelpers';
import * as createSource from '../../../api/createSource';

import mount from '../__mocks__/mount';
import { OPENSHIFT_NAME, CLOUD_VENDOR, REDHAT_VENDOR } from '../../../utilities/constants';
import SourcesFormRenderer from '../../../utilities/SourcesFormRenderer';
import CloseModal from '../../../components/CloseModal';

import LoadingStep from '../../../components/steps/LoadingStep';
import ErroredStep from '../../../components/steps/ErroredStep';
import FinishedStep from '../../../components/steps/FinishedStep';

describe('AddSourceWizard', () => {
  let initialProps;
  let wrapper;
  let SOURCE_DATA_OUT;

  beforeEach(() => {
    initialProps = {
      isOpen: true,
      sourceTypes,
      applicationTypes,
      onClose: jest.fn(),
    };

    SOURCE_DATA_OUT = {
      id: '1234',
      applications: [],
    };
  });

  it('renders correctly with sourceTypes', async () => {
    await act(async () => {
      wrapper = mount(<AddSourceWizard {...initialProps} />);
    });
    wrapper.update();

    expect(wrapper.find(Form)).toHaveLength(1);
    expect(wrapper.find(Modal)).toHaveLength(1);

    expect(wrapper.find(SourcesFormRenderer).props().schema.fields[0].fields[0].title).toEqual('Select source type');
    expect(wrapper.find(SourcesFormRenderer).props().schema.fields[0].fields[1].title).toEqual('Name source');
  });

  it('renders correctly without sourceTypes', async () => {
    dependency.doLoadSourceTypes = jest.fn(() => new Promise((resolve) => resolve({ sourceTypes })));

    await act(async () => {
      wrapper = mount(<AddSourceWizard {...initialProps} sourceTypes={undefined} />);
    });
    wrapper.update();

    expect(wrapper.find(Form)).toHaveLength(1);
    expect(wrapper.find(Modal)).toHaveLength(1);
    expect(dependency.doLoadSourceTypes).toHaveBeenCalled();
  });

  it('show finished step after filling the form', async () => {
    jest.useFakeTimers();
    expect.assertions(8);

    createSource.doCreateSource = jest.fn(() => new Promise((resolve) => setTimeout(() => resolve(SOURCE_DATA_OUT), 100)));

    await act(async () => {
      wrapper = mount(<AddSourceWizard {...initialProps} />);
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('Tile').first().simulate('click');
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('form').simulate('submit');
    });
    wrapper.update();

    expect(wrapper.find(FinalWizard)).toHaveLength(1);
    expect(wrapper.find(LoadingStep)).toHaveLength(1);
    expect(wrapper.find(ErroredStep)).toHaveLength(0);
    expect(wrapper.find(FinishedStep)).toHaveLength(0);

    await act(async () => {
      jest.advanceTimersByTime(100);
    });
    wrapper.update();

    expect(wrapper.find(FinalWizard)).toHaveLength(1);
    expect(wrapper.find(LoadingStep)).toHaveLength(0);
    expect(wrapper.find(ErroredStep)).toHaveLength(0);
    expect(wrapper.find(FinishedStep)).toHaveLength(1);

    jest.useRealTimers();
  });

  it('pass created source to afterSuccess function', async () => {
    const afterSubmitMock = jest.fn();
    createSource.doCreateSource = jest.fn(() => new Promise((resolve) => resolve({ name: 'source', applications: [] })));

    await act(async () => {
      wrapper = mount(<AddSourceWizard {...initialProps} afterSuccess={afterSubmitMock} />);
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('Tile').first().simulate('click');
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('form').simulate('submit');
    });
    wrapper.update();

    expect(afterSubmitMock).toHaveBeenCalledWith({ name: 'source', applications: [] });
  });

  it('pass created source to submitCallback function when success', async () => {
    const submitCallback = jest.fn();
    createSource.doCreateSource = jest.fn(() => new Promise((resolve) => resolve({ name: 'source', applications: [] })));

    await act(async () => {
      wrapper = mount(<AddSourceWizard {...initialProps} submitCallback={submitCallback} />);
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('Tile').first().simulate('click');
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('form').simulate('submit');
    });
    wrapper.update();

    expect(submitCallback).toHaveBeenCalledWith({
      createdSource: { name: 'source', applications: [] },
      isSubmitted: true,
      sourceTypes,
    });
  });

  it('pass values to submitCallback function when errors', async () => {
    const submitCallback = jest.fn();
    createSource.doCreateSource = jest.fn(() => new Promise((_, reject) => reject('Error - wrong name')));

    await act(async () => {
      wrapper = mount(<AddSourceWizard {...initialProps} submitCallback={submitCallback} />);
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('Tile').first().simulate('click');
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('form').simulate('submit');
    });
    wrapper.update();

    expect(submitCallback).toHaveBeenCalledWith({
      values: { source_type: OPENSHIFT_NAME },
      isErrored: true,
      sourceTypes,
      error: 'Error - wrong name',
      // because we are using form.submit in test instead of the button,
      // the state is not included
      wizardState: expect.any(Function),
    });
  });

  it('pass values to onClose function', async () => {
    const CANCEL_BUTTON_INDEX = 3;
    const onClose = jest.fn();

    await act(async () => {
      wrapper = mount(<AddSourceWizard {...initialProps} onClose={onClose} />);
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('Tile').first().simulate('click');
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('Button').at(CANCEL_BUTTON_INDEX).simulate('click');
    });

    wrapper.update();

    expect(wrapper.find(CloseModal)).toHaveLength(1);

    await act(async () => {
      wrapper.find('button#on-exit-button').simulate('click');
    });

    wrapper.update();

    expect(onClose).toHaveBeenCalledWith({ source_type: OPENSHIFT_NAME });
  });

  it('stay on the wizard', async () => {
    const CANCEL_BUTTON_INDEX = 3;
    const onClose = jest.fn();

    await act(async () => {
      wrapper = <AddSourceWizard {...initialProps} onClose={onClose} />);
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('Tile').first().simulate('click');
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('Button').at(CANCEL_BUTTON_INDEX).simulate('click');
    });
    wrapper.update();

    expect(wrapper.find(CloseModal)).toHaveLength(1);

    await act(async () => {
      wrapper.find('button#on-stay-button').simulate('click');
    });
    wrapper.update();

    expect(wrapper.find(CloseModal)).toHaveLength(0);

    expect(onClose).not.toHaveBeenCalled();
    expect(wrapper.find('Tile').first().props().isSelected).toEqual(true);
  });

  it('show error step after failing the form', async () => {
    const ERROR_MESSAGE = 'fail';
    createSource.doCreateSource = jest.fn(() => new Promise((_resolve, reject) => reject(ERROR_MESSAGE)));

    await act(async () => {
      wrapper = mount(<AddSourceWizard {...initialProps} />);
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('Tile').first().simulate('click');
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('form').simulate('submit');
    });
    wrapper.update();

    expect(wrapper.find(FinalWizard)).toHaveLength(1);
    expect(wrapper.find(FinishedStep)).toHaveLength(0);
    expect(wrapper.find(ErroredStep)).toHaveLength(1);
  });

  it('afterError closes wizard with no values', async () => {
    const closeCallback = jest.fn();

    createSource.doCreateSource = jest.fn(() => Promise.resolve(SOURCE_DATA_OUT));

    await act(async () => {
      wrapper = mount(<AddSourceWizard {...initialProps} onClose={closeCallback} />);
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('Tile').first().simulate('click');
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('form').simulate('submit');
    });
    wrapper.update();

    expect(closeCallback).not.toHaveBeenCalled();

    await act(async () => {
      wrapper.find(FinalWizard).props().afterError();
    });
    wrapper.update();

    expect(closeCallback).toHaveBeenCalledWith({});
  });

  it('afterSubmit closes wizard with values', async () => {
    const closeCallback = jest.fn();

    createSource.doCreateSource = jest.fn(() => Promise.resolve(SOURCE_DATA_OUT));

    await act(async () => {
      wrapper = mount(<AddSourceWizard {...initialProps} onClose={closeCallback} />);
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('Tile').first().simulate('click');
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('form').simulate('submit');
    });
    wrapper.update();

    expect(closeCallback).not.toHaveBeenCalled();

    await act(async () => {
      wrapper.find(FinalWizard).props().afterSubmit();
    });
    wrapper.update();

    expect(closeCallback).toHaveBeenCalledWith(undefined, SOURCE_DATA_OUT);
  });

  it('reset - resets initialValues', async () => {
    createSource.doCreateSource = jest.fn(() => Promise.resolve(SOURCE_DATA_OUT));

    await act(async () => {
      wrapper = mount(<AddSourceWizard {...initialProps} />);
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('Tile').first().simulate('click');
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('form').simulate('submit');
    });
    wrapper.update();

    await act(async () => {
      wrapper.find(FinalWizard).props().reset();
    });
    wrapper.update();

    expect(wrapper.find('Tile').first().props().isSelected).toEqual(false);
  });

  it('tryAgain retries the request', async () => {
    createSource.doCreateSource = jest.fn(() => Promise.resolve(SOURCE_DATA_OUT));

    await act(async () => {
      wrapper = mount(<AddSourceWizard {...initialProps} />);
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('Tile').first().simulate('click');
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('form').simulate('submit');
    });
    wrapper.update();

    createSource.doCreateSource.mockClear();
    expect(createSource.doCreateSource).not.toHaveBeenCalled();

    await act(async () => {
      wrapper.find(FinalWizard).props().tryAgain();
    });
    wrapper.update();

    expect(createSource.doCreateSource).toHaveBeenCalledWith(
      { source_type: OPENSHIFT_NAME },
      expect.any(Array),
      applicationTypes
    );
  });

  describe('different variants', () => {
    const getNavigation = (wrapper) => wrapper.find('.pf-c-wizard__nav-item').map((item) => item.text());

    it('show configuration step when selectedType is set - CLOUD', async () => {
      await act(async () => {
        wrapper = mount(<AddSourceWizard {...initialProps} selectedType="amazon" activeVendor={CLOUD_VENDOR} />);
      });
      wrapper.update();

      expect(getNavigation(wrapper)).toEqual(['Name source', 'Select configuration']);
    });

    it('show source type selection when CLOUD', async () => {
      await act(async () => {
        wrapper = mount(
          <AddSourceWizard {...initialProps} initialValues={{ source_type: 'amazon' }} activeVendor={CLOUD_VENDOR} />
        );
      });
      wrapper.update();

      expect(getNavigation(wrapper)).toEqual(['Select source type', 'Name source', 'Select configuration']);
    });

    it('show application step when selectedType is set and configuration is selected to true', async () => {
      await act(async () => {
        wrapper = mount(
          <AddSourceWizard
            {...initialProps}
            selectedType="amazon"
            initialValues={{ source: { app_creation_workflow: 'account_authorization' } }}
            activeVendor={CLOUD_VENDOR}
          />
        );
      });
      wrapper.update();

      expect(getNavigation(wrapper)).toEqual(['Name source', 'Select configuration', 'Select applications', 'Review details']);
    });

    it('show application step when selectedType is set and configuration is selected to false', async () => {
      await act(async () => {
        wrapper = mount(
          <AddSourceWizard
            {...initialProps}
            selectedType="amazon"
            initialValues={{ source: { app_creation_workflow: 'manual_configuration' } }}
            activeVendor={CLOUD_VENDOR}
          />
        );
      });
      wrapper.update();

      expect(getNavigation(wrapper)).toEqual(['Name source', 'Select configuration', 'Select application', 'Credentials']);
    });

    it('show application step when selectedType is set - RED HAT', async () => {
      await act(async () => {
        wrapper = mount(<AddSourceWizard {...initialProps} selectedType="openshift" activeVendor={REDHAT_VENDOR} />);
      });
      wrapper.update();

      expect(getNavigation(wrapper)).toEqual([
        'Name source',
        'Select application',
        'Credentials',
        'Configure OpenShift endpoint',
        'Review details',
      ]);
    });

    it('show source type selection when REDHAT', async () => {
      await act(async () => {
        wrapper = mount(<AddSourceWizard {...initialProps} activeVendor={REDHAT_VENDOR} />);
      });
      wrapper.update();

      expect(getNavigation(wrapper)).toEqual(['Source type and application', 'Name source']);
    });
  });

  it('pass initialWizardState to wizard', async () => {
    await act(async () => {
      wrapper = mount(<AddSourceWizard {...initialProps} initialWizardState={{ some: 'state' }} />);
    });
    wrapper.update();

    expect(wrapper.find(SourcesFormRenderer).props().schema.fields[0].initialState).toEqual({ some: 'state' });
  });
});
