import rendererContext from '@data-driven-forms/react-form-renderer/dist/cjs/renderer-context';

import { AuthTypeCleaner } from '../../../components/AddApplication/AuthTypeCleaner';

describe('AuthTypeCleaner', () => {
  let initialProps;
  let formOptions;
  let changeSpy;

  class Wrapper extends React.Component {
    render() {
      const { formOptions, ...props } = this.props;

      return (
        <rendererContext.Provider value={{ formOptions }}>
          <AuthTypeCleaner {...props} />
        </rendererContext.Provider>
      );
    }
  }

  beforeEach(() => {
    changeSpy = jest.fn().mockImplementation();

    formOptions = {
      batch: jest.fn().mockImplementation((fn) => fn()),
      getState: jest.fn().mockImplementation(() => ({ values: {} })),
      change: changeSpy,
    };

    initialProps = {
      formOptions,
    };
  });

  it('change authentication when selected app is changed', () => {
    const wrapper = mount(<Wrapper {...initialProps} />);

    expect(changeSpy).not.toHaveBeenCalled();
    changeSpy.mockClear();

    wrapper.setProps({
      formOptions: {
        ...formOptions,
        getState: jest.fn().mockImplementation(() => ({
          values: {
            application: {
              application_type_id: 'cosi',
            },
          },
        })),
      },
    });

    expect(changeSpy.mock.calls[0][0]).toEqual('authentication');
    expect(changeSpy.mock.calls[0][1]).toEqual(undefined);

    expect(changeSpy.mock.calls[1][0]).toEqual('selectedAuthentication');
    expect(changeSpy.mock.calls[1][1]).toEqual(undefined);

    expect(changeSpy.mock.calls.length).toEqual(2);
    changeSpy.mockClear();

    wrapper.setProps({
      formOptions: {
        ...formOptions,
        getState: jest.fn().mockImplementation(() => ({
          values: {
            application: {
              application_type_id: undefined,
            },
          },
        })),
      },
    });

    expect(changeSpy.mock.calls[0][0]).toEqual('authentication');
    expect(changeSpy.mock.calls[0][1]).toEqual(undefined);

    expect(changeSpy.mock.calls[1][0]).toEqual('selectedAuthentication');
    expect(changeSpy.mock.calls[1][1]).toEqual(undefined);

    expect(changeSpy.mock.calls.length).toEqual(2);
    changeSpy.mockClear();
  });

  it('do not reset when selectedApplication is defined on initialRender', () => {
    formOptions = {
      ...formOptions,
      getState: jest.fn().mockImplementation(() => ({
        values: {
          application: {
            application_type_id: 'cosi',
          },
        },
      })),
    };

    const wrapper = mount(<Wrapper {...initialProps} />);

    expect(changeSpy).not.toHaveBeenCalled();
    changeSpy.mockClear();

    wrapper.setProps({
      formOptions: {
        ...formOptions,
        getState: jest.fn().mockImplementation(() => ({
          values: {
            application: {
              application_type_id: 'cosi2',
            },
          },
        })),
      },
    });

    expect(changeSpy.mock.calls[0][0]).toEqual('authentication');
    expect(changeSpy.mock.calls[0][1]).toEqual(undefined);

    expect(changeSpy.mock.calls[1][0]).toEqual('selectedAuthentication');
    expect(changeSpy.mock.calls[1][1]).toEqual(undefined);

    expect(changeSpy.mock.calls.length).toEqual(2);
    changeSpy.mockClear();

    wrapper.setProps({
      formOptions: {
        ...formOptions,
        getState: jest.fn().mockImplementation(() => ({
          values: {
            application: {
              application_type_id: 'cosi',
            },
          },
        })),
      },
    });

    expect(changeSpy.mock.calls[0][0]).toEqual('authentication');
    expect(changeSpy.mock.calls[0][1]).toEqual(undefined);

    expect(changeSpy.mock.calls[1][0]).toEqual('selectedAuthentication');
    expect(changeSpy.mock.calls[1][1]).toEqual(undefined);

    expect(changeSpy.mock.calls.length).toEqual(2);
    changeSpy.mockClear();
  });
});
