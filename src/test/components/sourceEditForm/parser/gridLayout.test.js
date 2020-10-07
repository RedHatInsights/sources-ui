import { act } from 'react-dom/test-utils';

import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import TextField from '@data-driven-forms/pf4-component-mapper/dist/cjs/text-field';

import SourcesFormRenderer from '../../../../utilities/SourcesFormRenderer';
import GridLayout from '../../../../components/SourceEditForm/parser/GridLayout';
import AuthenticationId from '../../../../components/SourceEditForm/parser/AuthenticationId';

import { componentWrapperIntl } from '../../../../utilities/testsHelpers';
import sourceEditContext from '../../../../components/SourceEditForm/sourceEditContext';
import { Button } from '@patternfly/react-core';
import RemoveAuthPlaceholder from '../../../../components/SourceEditForm/parser/RemoveAuthPlaceholder';

describe('GridLayout', () => {
  let setState;
  let source;

  beforeEach(() => {
    setState = jest.fn();
    source = {
      authentications: [{ id: '1234' }],
    };
  });

  it('renders correctly', () => {
    const wrapper = mount(
      componentWrapperIntl(
        <sourceEditContext.Provider
          value={{
            setState,
            source,
          }}
        >
          <SourcesFormRenderer
            onSubmit={jest.fn()}
            schema={{
              fields: [
                {
                  component: 'description',
                  name: 'alert',
                  Content: GridLayout,
                  id: '1234',
                  fields: [
                    {
                      component: componentTypes.TEXT_FIELD,
                      name: 'some-field',
                    },
                  ],
                },
              ],
            }}
          />
        </sourceEditContext.Provider>
      )
    );

    expect(wrapper.find(AuthenticationId).props().id).toEqual('1234');
    expect(wrapper.find(TextField)).toHaveLength(1);
    expect(wrapper.find(RemoveAuthPlaceholder)).toHaveLength(0);
  });

  it('renders removing', () => {
    const wrapper = mount(
      componentWrapperIntl(
        <sourceEditContext.Provider
          value={{
            setState,
            source: {
              authentications: [{ id: '1234', isDeleting: true }],
            },
          }}
        >
          <SourcesFormRenderer
            onSubmit={jest.fn()}
            schema={{
              fields: [
                {
                  component: 'description',
                  name: 'alert',
                  Content: GridLayout,
                  id: '1234',
                  fields: [
                    {
                      component: componentTypes.TEXT_FIELD,
                      name: 'some-field',
                    },
                  ],
                },
              ],
            }}
          />
        </sourceEditContext.Provider>
      )
    );

    expect(wrapper.find(AuthenticationId)).toHaveLength(0);
    expect(wrapper.find(TextField)).toHaveLength(0);
    expect(wrapper.find(RemoveAuthPlaceholder)).toHaveLength(1);
  });

  it('set removes', async () => {
    const wrapper = mount(
      componentWrapperIntl(
        <sourceEditContext.Provider
          value={{
            setState,
            source,
          }}
        >
          <SourcesFormRenderer
            onSubmit={jest.fn()}
            schema={{
              fields: [
                {
                  component: 'description',
                  name: 'alert',
                  Content: GridLayout,
                  id: '1234',
                  fields: [
                    {
                      component: componentTypes.TEXT_FIELD,
                      name: 'some-field',
                    },
                  ],
                },
              ],
            }}
          />
        </sourceEditContext.Provider>
      )
    );

    await act(async () => {
      wrapper.find(GridLayout).find(Button).simulate('click');
    });
    wrapper.update();

    expect(setState).toHaveBeenCalledWith({
      type: 'setAuthRemoving',
      removingAuth: '1234',
    });
  });
});
