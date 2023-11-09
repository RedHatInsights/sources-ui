import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import componentMapper from '@data-driven-forms/pf4-component-mapper/component-mapper';

import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import SourcesFormRenderer from '../../../utilities/SourcesFormRenderer';
import ModalFormTemplate from '../../../components/CredentialsForm/ModalFormTemplate';

describe('modalFormTemplate', () => {
  let submit;
  let reset;
  let cancel;

  beforeEach(() => {
    submit = jest.fn();
    reset = jest.fn();
    cancel = jest.fn();

    render(
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
        />,
      ),
    );
  });

  it('submits', async () => {
    const user = userEvent.setup();

    expect(submit).not.toHaveBeenCalled();

    await waitFor(async () => {
      await user.type(screen.getByRole('textbox'), 'something');
    });

    await waitFor(async () => {
      await user.click(screen.getByText('Submit'));
    });

    expect(submit).toHaveBeenCalled();
  });

  it('cancels', async () => {
    const user = userEvent.setup();

    expect(cancel).not.toHaveBeenCalled();

    await waitFor(async () => {
      await user.click(screen.getByText('Cancel'));
    });

    expect(cancel).toHaveBeenCalled();
  });
});
