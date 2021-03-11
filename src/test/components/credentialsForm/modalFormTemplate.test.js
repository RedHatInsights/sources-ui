import { act } from 'react-dom/test-utils';

import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import componentMapper from '@data-driven-forms/pf4-component-mapper/component-mapper';

import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import SourcesFormRenderer from '../../../utilities/SourcesFormRenderer';
import ModalFormTemplate from '../../../components/CredentialsForm/ModalFormTemplate';

describe('modalFormTemplate', () => {
  let wrapper;
  let submit;
  let reset;
  let cancel;

  beforeEach(() => {
    submit = jest.fn();
    reset = jest.fn();
    cancel = jest.fn();

    wrapper = mount(
      componentWrapperIntl(
        <SourcesFormRenderer
          schema={{
            fields: [
              {
                component: componentTypes.TEXT_FIELD,
                name: 'name',
                initialValue: 'some-name',
              },
            ],
          }}
          componentMapper={componentMapper}
          FormTemplate={(props) => (
            <ModalFormTemplate
              ModalProps={{
                isOpen: true,
                title: 'Some title',
              }}
              {...props}
            />
          )}
          onSubmit={submit}
          onReset={reset}
          onCancel={cancel}
        />
      )
    );
  });

  it('submits', async () => {
    expect(submit).not.toHaveBeenCalled();

    await act(async () => {
      wrapper.find('form').simulate('submit');
    });
    wrapper.update();

    expect(submit).toHaveBeenCalled();
  });

  it('cancels', async () => {
    expect(cancel).not.toHaveBeenCalled();

    await act(async () => {
      wrapper.find('button#cancel-modal').simulate('click');
    });
    wrapper.update();

    expect(cancel).toHaveBeenCalled();
  });
});
