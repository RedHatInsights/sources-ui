import { mount } from 'enzyme';
import { Route } from 'react-router-dom';

import rendererContext from '@data-driven-forms/react-form-renderer/dist/esm/renderer-context';

import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import { sourceTypesData, OPENSHIFT_ID } from '../../__mocks__/sourceTypesData';
import { AuthTypeSetter } from '../../../components/AddApplication/AuthTypeSetter';
import { routes, replaceRouteId } from '../../../Routes';
import mockStore from '../../__mocks__/mockStore';

describe('AuthTypeSetter', () => {
  let store;
  let initialProps;
  let formOptions;
  let changeSpy;

  const AUTH_VALUES1 = {
    id: '23231',
    password: 'password',
    name: 'lojza',
    authtype: 'token',
  };

  const AUTH_VALUES2 = {
    id: '09862',
    azure: {
      extra: {
        tenant: 'US-EAST1',
      },
    },
    authtype: 'token_extra',
  };

  const authenticationValues = [AUTH_VALUES1, AUTH_VALUES2];

  const appTypes = [
    {
      id: '6898778',
      supported_authentication_types: {
        openshift: ['token'],
      },
    },
    {
      id: '986421686456',
      supported_authentication_types: {
        openshift: ['token_extra'],
      },
    },
  ];

  const SOURCE_ID = '232232';

  const SOURCE = {
    id: SOURCE_ID,
    source_type_id: OPENSHIFT_ID,
    applications: [],
  };

  const initialEntry = [replaceRouteId(routes.sourcesDetail.path, SOURCE_ID)];

  class Wrapper extends React.Component {
    render() {
      const { formOptions, ...props } = this.props;

      return componentWrapperIntl(
        <rendererContext.Provider value={{ formOptions }}>
          <Route path={routes.sourcesDetail.path} render={(...args) => <AuthTypeSetter {...args} {...props} />} />
        </rendererContext.Provider>,
        store,
        initialEntry
      );
    }
  }

  beforeEach(() => {
    store = mockStore({
      sources: {
        entities: [SOURCE],
        appTypes,
        sourceTypes: sourceTypesData.data,
        appTypesLoaded: true,
        sourceTypesLoaded: true,
        loaded: 0,
      },
    });

    changeSpy = jest.fn().mockImplementation();

    formOptions = {
      getState: jest.fn().mockImplementation(() => ({ values: {} })),
      change: changeSpy,
    };

    initialProps = {
      formOptions,
      authenticationValues,
    };
  });

  it('change authentication when selectedAuthentication is changed', () => {
    const wrapper = mount(<Wrapper {...initialProps} />);

    expect(changeSpy).not.toHaveBeenCalled();
    changeSpy.mockClear();

    wrapper.setProps({
      formOptions: {
        ...formOptions,
        getState: jest.fn().mockImplementation(() => ({
          values: {
            selectedAuthentication: 'new-token',
          },
        })),
      },
    });

    expect(changeSpy).toHaveBeenCalledWith('authentication', {
      authtype: 'token',
    });
    expect(changeSpy.mock.calls.length).toEqual(1);
    changeSpy.mockClear();

    wrapper.setProps({
      formOptions: {
        ...formOptions,
        getState: jest.fn().mockImplementation(() => ({
          values: {
            selectedAuthentication: '23231',
          },
        })),
      },
    });

    expect(changeSpy).toHaveBeenCalledWith('authentication', AUTH_VALUES1);
    expect(changeSpy.mock.calls.length).toEqual(1);
    changeSpy.mockClear();

    wrapper.setProps({
      formOptions: {
        ...formOptions,
        getState: jest.fn().mockImplementation(() => ({
          values: {
            selectedAuthentication: '23231',
          },
        })),
      },
    });

    expect(changeSpy).not.toHaveBeenCalled();
    changeSpy.mockClear();

    wrapper.setProps({
      formOptions: {
        ...formOptions,
        getState: jest.fn().mockImplementation(() => ({
          values: {
            selectedAuthentication: '09862',
          },
        })),
      },
    });

    expect(changeSpy).toHaveBeenCalledWith('authentication', AUTH_VALUES2);
    expect(changeSpy.mock.calls.length).toEqual(1);
    changeSpy.mockClear();

    wrapper.setProps({
      formOptions: {
        ...formOptions,
        getState: jest.fn().mockImplementation(() => ({
          values: {
            selectedAuthentication: 'new-token',
          },
        })),
      },
    });

    expect(changeSpy).toHaveBeenCalledWith('authentication', {
      authtype: 'token',
    });
    expect(changeSpy.mock.calls.length).toEqual(1);
    changeSpy.mockClear();
  });

  it('do not reset when selectedApplication is defined on initialRender', () => {
    formOptions = {
      ...formOptions,
      getState: jest.fn().mockImplementation(() => ({
        values: {
          selectedAuthentication: 'new-token-extra',
        },
      })),
    };

    const wrapper = mount(<Wrapper {...initialProps} formOptions={formOptions} />);

    expect(changeSpy).not.toHaveBeenCalled();
    changeSpy.mockClear();

    wrapper.setProps({
      formOptions: {
        ...formOptions,
        getState: jest.fn().mockImplementation(() => ({
          values: {
            selectedAuthentication: '09862',
          },
        })),
      },
    });

    expect(changeSpy).toHaveBeenCalledWith('authentication', AUTH_VALUES2);
    expect(changeSpy.mock.calls.length).toEqual(1);
    changeSpy.mockClear();

    wrapper.setProps({
      formOptions: {
        ...formOptions,
        getState: jest.fn().mockImplementation(() => ({
          values: {
            selectedAuthentication: 'new-token-extra',
          },
        })),
      },
    });

    expect(changeSpy).toHaveBeenCalledWith('authentication', {
      authtype: 'token-extra',
    });
    expect(changeSpy.mock.calls.length).toEqual(1);
    changeSpy.mockClear();
  });
});
