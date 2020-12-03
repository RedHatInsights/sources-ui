import {
  getEditedApplications,
  prepareInitialValues,
  prepareMessages,
  selectOnlyEditedValues,
} from '../../../components/SourceEditForm/helpers';
import applicationTypesData, { COSTMANAGEMENT_APP } from '../../__mocks__/applicationTypesData';

describe('edit form helpers', () => {
  describe('selectOnlyEditedValues', () => {
    it('returns only edited values', () => {
      const VALUES = {
        nested: {
          name: '1',
        },
        url: 'http://redhat.com',
        nonEditedValue: 'something',
      };

      const EDITING = {
        'nested.name': true,
        url: true,
      };

      const EXPECTED_VALUES = {
        nested: {
          name: '1',
        },
        url: 'http://redhat.com',
      };

      expect(selectOnlyEditedValues(VALUES, EDITING)).toEqual(EXPECTED_VALUES);
    });
  });

  describe('prepareInitialValues', () => {
    const SOURCE_TYPE_NAME = 'openshift';

    const AUTH_ID1 = '123';
    const AUTH_ID2 = '2342';

    const SOURCE = {
      source: { name: 'name' },
      endpoints: [{ id: '123' }],
      authentications: [{ id: AUTH_ID1 }, { id: AUTH_ID2 }],
    };

    const EXPECTED_INITIAL_VALUES = {
      source: SOURCE.source,
      endpoint: SOURCE.endpoints[0],
      authentications: {
        [`a${AUTH_ID1}`]: SOURCE.authentications[0],
        [`a${AUTH_ID2}`]: SOURCE.authentications[1],
      },
      source_type: SOURCE_TYPE_NAME,
      url: undefined,
    };

    it('prepares initial values', () => {
      expect(prepareInitialValues(SOURCE, SOURCE_TYPE_NAME)).toEqual(EXPECTED_INITIAL_VALUES);
    });

    it('prepares initial values with apps auths', () => {
      const SOURCE_WITH_APPS = {
        ...SOURCE,
        applications: [
          {
            authentications: [
              {
                authtype: 'super-type-1',
                id: 'st1',
              },
              {
                authtype: 'super-type-2',
                id: 'st2',
              },
            ],
          },
          {
            authentications: [
              {
                authtype: 'super-type-3',
                id: 'st3',
              },
            ],
          },
        ],
      };

      expect(prepareInitialValues(SOURCE_WITH_APPS, SOURCE_TYPE_NAME)).toEqual({
        ...EXPECTED_INITIAL_VALUES,
        authentications: {
          ...EXPECTED_INITIAL_VALUES.authentications,
          ast1: {
            authtype: 'super-type-1',
            id: 'st1',
          },
          ast2: {
            authtype: 'super-type-2',
            id: 'st2',
          },
          ast3: {
            authtype: 'super-type-3',
            id: 'st3',
          },
        },
      });
    });

    it('prepares initial values with URL', () => {
      const SOURCE_WITH_URL = {
        ...SOURCE,
        endpoints: [{ id: '123', scheme: 'https', host: 'redhat.com' }],
      };

      const EXPECTED_INITIAL_VALUES_WITH_URL = {
        ...EXPECTED_INITIAL_VALUES,
        endpoint: SOURCE_WITH_URL.endpoints[0],
        url: `${SOURCE_WITH_URL.endpoints[0].scheme}://${SOURCE_WITH_URL.endpoints[0].host}`,
      };

      expect(prepareInitialValues(SOURCE_WITH_URL, SOURCE_TYPE_NAME)).toEqual(EXPECTED_INITIAL_VALUES_WITH_URL);
    });

    it('prepares initial values with empty authetications', () => {
      const SOURCE_WITH_NO_AUTHS = {
        ...SOURCE,
        authentications: [],
      };

      const EXPECTED_INITIAL_VALUES_WITH_NO_AUTHS = {
        ...EXPECTED_INITIAL_VALUES,
        authentications: {},
      };

      expect(prepareInitialValues(SOURCE_WITH_NO_AUTHS, SOURCE_TYPE_NAME)).toEqual(EXPECTED_INITIAL_VALUES_WITH_NO_AUTHS);
    });

    it('prepares initial values with undefined authetications', () => {
      const SOURCE_WITH_UNDEF_AUTHS = {
        ...SOURCE,
        authentications: undefined,
      };

      const EXPECTED_INITIAL_VALUES_WITH_UNDEF_AUTHS = {
        ...EXPECTED_INITIAL_VALUES,
        authentications: {},
      };

      expect(prepareInitialValues(SOURCE_WITH_UNDEF_AUTHS, SOURCE_TYPE_NAME)).toEqual(EXPECTED_INITIAL_VALUES_WITH_UNDEF_AUTHS);
    });

    it('prepares initial values with empty endpoint', () => {
      const SOURCE_WITH_NO_ENDPOINTS = {
        ...SOURCE,
        endpoints: [],
      };

      const EXPECTED_INITIAL_VALUES_WITH_NO_ENDPOINTS = {
        ...EXPECTED_INITIAL_VALUES,
        endpoint: undefined,
      };

      expect(prepareInitialValues(SOURCE_WITH_NO_ENDPOINTS, SOURCE_TYPE_NAME)).toEqual(EXPECTED_INITIAL_VALUES_WITH_NO_ENDPOINTS);
    });

    it('prepares initial values with undefined endpoints', () => {
      const SOURCE_WITH_UNDEF_ENDPOINTS = {
        ...SOURCE,
        endpoints: undefined,
      };

      const EXPECTED_INITIAL_VALUES_WITH_UNDEF_ENDPOINTS = {
        ...EXPECTED_INITIAL_VALUES,
        endpoint: undefined,
      };

      expect(prepareInitialValues(SOURCE_WITH_UNDEF_ENDPOINTS, SOURCE_TYPE_NAME)).toEqual(
        EXPECTED_INITIAL_VALUES_WITH_UNDEF_ENDPOINTS
      );
    });

    it('prepares initial values with cost management values', () => {
      const SOURCE_WITH_UNDEF_ENDPOINTS = {
        ...SOURCE,
        billing_source: { bucket: 'bucket' },
        credentials: { subscription_id: '122' },
      };

      const EXPECTED_INITIAL_VALUES_WITH_UNDEF_ENDPOINTS = {
        ...EXPECTED_INITIAL_VALUES,
        billing_source: { bucket: 'bucket' },
        credentials: { subscription_id: '122' },
      };

      expect(prepareInitialValues(SOURCE_WITH_UNDEF_ENDPOINTS, SOURCE_TYPE_NAME)).toEqual(
        EXPECTED_INITIAL_VALUES_WITH_UNDEF_ENDPOINTS
      );
    });
  });

  describe('getEditedApplications', () => {
    let source;
    let edited;

    const appTypes = applicationTypesData.data;

    it('assigns applications to app id', () => {
      edited = {
        'applications.a1.password': true,
        'applications.a1.username': true,
        'applications.a2.username': false,
        'applications.a3.password': true,
      };

      expect(getEditedApplications(source, edited, appTypes)).toEqual(['1', '3']);
    });

    it('assigns authentications to app id', () => {
      source = {
        applications: [
          { id: '123', authentications: [{ id: '1', resource_type: 'Application' }] },
          { id: '456', authentications: [{ id: '2', resource_type: 'Endpoint' }] },
        ],
      };

      edited = {
        'authentications.a1.password': true,
        'authentications.a1.username': true,
        'authentications.a2.username': true,
      };

      expect(getEditedApplications(source, edited, appTypes)).toEqual(['123', 'check-endpoint-456']);
    });

    it('assigns endpoint to app id using URL', () => {
      source = {
        applications: [
          { id: '123', authentications: [] },
          { id: '456', authentications: [{ id: '2', resource_type: 'Endpoint' }] },
        ],
      };

      edited = {
        url: true,
      };

      expect(getEditedApplications(source, edited, appTypes)).toEqual(['check-endpoint-456']);
    });

    it('assigns endpoint to app id using endpoint value', () => {
      source = {
        applications: [
          { id: '123', authentications: [{ id: '234', resource_type: 'Endpoint' }] },
          { id: '456', authentications: [{ id: '2', resource_type: 'Endpoint' }] },
        ],
      };

      edited = {
        'endpoint.role': true,
      };

      expect(getEditedApplications(source, edited, appTypes)).toEqual(['check-endpoint-123', 'check-endpoint-456']);
    });

    it('edit cost management billing_source', () => {
      source = {
        applications: [
          { id: '123', authentications: [] },
          { id: '456', application_type_id: COSTMANAGEMENT_APP.id },
        ],
      };

      edited = {
        'billing_source.role': true,
      };

      expect(getEditedApplications(source, edited, appTypes)).toEqual(['456']);
    });

    it('edit cost management credentials', () => {
      source = {
        applications: [
          { id: '123', authentications: [] },
          { id: '456', application_type_id: COSTMANAGEMENT_APP.id },
        ],
      };

      edited = {
        'credentials.role': true,
      };

      expect(getEditedApplications(source, edited, appTypes)).toEqual(['456']);
    });
  });

  describe('prepareMessages', () => {
    let source;
    let intl = { formatMessage: ({ defaultMessage }) => defaultMessage };

    it('prepare application messages', () => {
      source = {
        applications: [
          { id: 'app1', availability_status_error: 'some error' },
          { id: 'app2' },
          { id: 'app3', availability_status_error: 'some error 3' },
        ],
      };

      expect(prepareMessages(source, intl)).toEqual({
        app1: {
          description: 'some error',
          title: 'This application is unavailable',
          variant: 'danger',
        },
        app3: {
          description: 'some error 3',
          title: 'This application is unavailable',
          variant: 'danger',
        },
      });
    });

    it('prepare endpoint messages', () => {
      source = {
        applications: [
          { id: 'app1', authentications: [{ resource_type: 'Endpoint' }] },
          { id: 'app2', authentications: [] },
          { id: 'app3', authentications: [{ resource_type: 'Endpoint' }] },
        ],
        endpoints: [{ availability_status_error: 'endpoint error' }],
      };

      expect(prepareMessages(source, intl)).toEqual({
        app1: {
          description: 'endpoint error',
          title: 'This application is unavailable',
          variant: 'danger',
        },
        app3: {
          description: 'endpoint error',
          title: 'This application is unavailable',
          variant: 'danger',
        },
      });
    });
  });
});
