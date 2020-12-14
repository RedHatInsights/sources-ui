import React from 'react';
import { act } from 'react-dom/test-utils';
import {
  nameFormatter,
  dateFormatter,
  sourceTypeFormatter,
  applicationFormatter,
  importedFormatter,
  formatURL,
  sourceIsOpenShift,
  defaultPort,
  schemaToPort,
  endpointToUrl,
  importsTexts,
  availabilityFormatter,
  getStatusText,
  getStatusTooltipText,
  formatAvailibilityErrors,
  getAllErrors,
  AVAILABLE,
  PARTIALLY_UNAVAILABLE,
  UNAVAILABLE,
  UnknownError,
  getStatusColor,
} from '../../views/formatters';
import { sourceTypesData, OPENSHIFT_ID, AMAZON_ID, OPENSHIFT_INDEX } from '../__mocks__/sourceTypesData';
import {
  sourcesDataGraphQl,
  SOURCE_CATALOGAPP_INDEX,
  SOURCE_ALL_APS_INDEX,
  SOURCE_NO_APS_INDEX,
  SOURCE_ENDPOINT_URL_INDEX,
} from '../__mocks__/sourcesData';
import {
  applicationTypesData,
  CATALOG_INDEX,
  TOPOLOGICALINVENTORY_INDEX,
  COSTMANAGEMENET_INDEX,
  COSTMANAGEMENT_APP,
  CATALOG_APP,
} from '../__mocks__/applicationTypesData';
import { Badge, Tooltip, Label, LabelGroup, Popover } from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/components/cjs/DateFormat';
import { IntlProvider } from 'react-intl';
import { componentWrapperIntl } from '../../utilities/testsHelpers';

describe('formatters', () => {
  const wrapperWithIntl = (children) => <IntlProvider locale="en">{children}</IntlProvider>;

  describe('sourceIsOpenShift', () => {
    it('returns true when is openshift', () => {
      expect(sourceIsOpenShift({ source_type_id: OPENSHIFT_ID }, sourceTypesData.data)).toEqual(true);
    });

    it('returns false when is not openshift', () => {
      expect(sourceIsOpenShift({ source_type_id: AMAZON_ID }, sourceTypesData.data)).toEqual(false);
    });
  });

  describe('sourceTypeFormatter', () => {
    it('returns product_name (OpenShift)', () => {
      expect(
        sourceTypeFormatter(OPENSHIFT_ID, undefined, {
          sourceTypes: sourceTypesData.data,
        })
      ).toEqual(sourceTypesData.data.find((x) => x.id === OPENSHIFT_ID).product_name);
    });

    it('returns type when there is no product_name', () => {
      expect(
        sourceTypeFormatter(OPENSHIFT_ID, undefined, {
          sourceTypes: [
            {
              ...sourceTypesData.data[OPENSHIFT_INDEX],
              product_name: undefined,
            },
          ],
        })
      ).toEqual(OPENSHIFT_ID);
    });

    it('returns empty string when no sourceType', () => {
      expect(
        sourceTypeFormatter(undefined, undefined, {
          sourceTypes: sourceTypesData.data,
        })
      ).toEqual('');
    });
  });

  describe('dateFormatter', () => {
    it('returns parsed date', () => {
      const wrapper = mount(dateFormatter(sourcesDataGraphQl[0].created_at));

      expect(wrapper.find(DateFormat)).toHaveLength(1);
    });
  });

  describe('nameFormatter', () => {
    it('returns name', () => {
      expect(
        JSON.stringify(
          nameFormatter(sourcesDataGraphQl[0].name, sourcesDataGraphQl[0], {
            sourceTypes: sourceTypesData.data,
          })
        ).includes(sourcesDataGraphQl[0].name)
      ).toEqual(true);
    });
  });

  describe('importedFormatter', () => {
    it('returns null when undefined value', () => {
      expect(importedFormatter(undefined)).toEqual(null);
    });

    it('returns only imported badge', () => {
      const wrapper = mount(<IntlProvider locale="en">{importedFormatter('value with no text')}</IntlProvider>);

      expect(wrapper.find(Badge)).toHaveLength(1);
      expect(wrapper.find(Tooltip)).toHaveLength(0);
    });

    it('returns imported badge with tooltip', () => {
      const wrapper = mount(<IntlProvider locale="en">{importedFormatter('cfme')}</IntlProvider>);

      expect(wrapper.find(Badge)).toHaveLength(1);
      expect(wrapper.find(Tooltip)).toHaveLength(1);
    });
  });

  describe('applicationFormatter', () => {
    it('returns full application list', async () => {
      const wrapper = mount(
        componentWrapperIntl(
          <React.Fragment>
            {applicationFormatter(sourcesDataGraphQl[SOURCE_ALL_APS_INDEX].applications, undefined, {
              appTypes: applicationTypesData.data,
            })}
          </React.Fragment>
        )
      );

      expect(wrapper.find(LabelGroup)).toHaveLength(1);
      expect(wrapper.find(Label)).toHaveLength(3);
      expect(wrapper.find(Popover)).toHaveLength(2);

      expect(wrapper.find(Label).at(0).props().children).toEqual(applicationTypesData.data[CATALOG_INDEX].display_name);
      expect(wrapper.find(Label).at(1).props().children).toEqual(applicationTypesData.data[COSTMANAGEMENET_INDEX].display_name);
      expect(wrapper.find(Label).at(2).props().children).toEqual('1 more');

      await act(async () => {
        wrapper.find(Label).at(2).simulate('click');
      });
      wrapper.update();

      expect(wrapper.find(Label).at(2).props().children).toEqual(
        applicationTypesData.data[TOPOLOGICALINVENTORY_INDEX].display_name
      );
    });

    it('returns empty application list', () => {
      const EMPTY_LIST_PLACEHOLDER = '--';

      const wrapper = mount(
        componentWrapperIntl(
          <React.Fragment>
            {applicationFormatter(sourcesDataGraphQl[SOURCE_NO_APS_INDEX].applications, undefined, {
              appTypes: applicationTypesData.data,
            })}
          </React.Fragment>
        )
      );

      expect(wrapper.text()).toEqual(EMPTY_LIST_PLACEHOLDER);
      expect(wrapper.find(LabelGroup)).toHaveLength(0);
      expect(wrapper.find(Label)).toHaveLength(0);
      expect(wrapper.find(Popover)).toHaveLength(0);
    });

    it('returns application list with one item (catalog)', () => {
      const wrapper = mount(
        componentWrapperIntl(
          <React.Fragment>
            {applicationFormatter(sourcesDataGraphQl[SOURCE_CATALOGAPP_INDEX].applications, undefined, {
              appTypes: applicationTypesData.data,
            })}
          </React.Fragment>
        )
      );

      expect(wrapper.find(LabelGroup)).toHaveLength(1);
      expect(wrapper.find(Label)).toHaveLength(1);
      expect(wrapper.find(Popover)).toHaveLength(1);

      expect(wrapper.find(Label).at(0).props().children).toEqual(applicationTypesData.data[CATALOG_INDEX].display_name);
    });

    it('show available popover', () => {
      const wrapper = mount(
        componentWrapperIntl(
          <React.Fragment>
            {applicationFormatter(
              [
                {
                  application_type_id: COSTMANAGEMENT_APP.id,
                  availability_status: AVAILABLE,
                },
              ],
              undefined,
              {
                appTypes: applicationTypesData.data,
              }
            )}
          </React.Fragment>
        )
      );

      expect(wrapper.find(Popover).props().bodyContent).toEqual('Everything works fine.');
    });

    it('show unavailable popover', () => {
      const ERROR = 'some error';
      const wrapper = mount(
        componentWrapperIntl(
          <React.Fragment>
            {applicationFormatter(
              [
                {
                  application_type_id: COSTMANAGEMENT_APP.id,
                  availability_status: UNAVAILABLE,
                  availability_status_error: ERROR,
                },
              ],
              undefined,
              {
                appTypes: applicationTypesData.data,
              }
            )}
          </React.Fragment>
        )
      );

      expect(wrapper.find(Popover).props().bodyContent).toEqual(ERROR);
    });

    it('show unavailable popover - endpoint error', () => {
      const ERROR = 'some error';
      const wrapper = mount(
        componentWrapperIntl(
          <React.Fragment>
            {applicationFormatter(
              [
                {
                  application_type_id: COSTMANAGEMENT_APP.id,
                  availability_status: null,
                  authentications: [{ resource_type: 'Endpoint' }],
                },
              ],
              { endpoints: [{ availability_status: UNAVAILABLE, availability_status_error: ERROR }] },
              {
                appTypes: applicationTypesData.data,
              }
            )}
          </React.Fragment>
        )
      );

      expect(wrapper.find(Popover).props().bodyContent).toEqual(ERROR);
    });

    it('show unavailable popover - unknown error', () => {
      const wrapper = mount(
        componentWrapperIntl(
          <React.Fragment>
            {applicationFormatter(
              [
                {
                  application_type_id: COSTMANAGEMENT_APP.id,
                  availability_status: UNAVAILABLE,
                  availability_status_error: null,
                },
              ],
              undefined,
              {
                appTypes: applicationTypesData.data,
              }
            )}
          </React.Fragment>
        )
      );

      expect(wrapper.find(Popover).props().bodyContent).toEqual('Unknown error');
    });

    it('show unknown popover', () => {
      const wrapper = mount(
        componentWrapperIntl(
          <React.Fragment>
            {applicationFormatter(
              [
                {
                  application_type_id: COSTMANAGEMENT_APP.id,
                  availability_status: null,
                  availability_status_error: null,
                },
              ],
              undefined,
              {
                appTypes: applicationTypesData.data,
              }
            )}
          </React.Fragment>
        )
      );

      expect(wrapper.find(Popover).props().bodyContent).toEqual('Status has not been verified.');
    });
  });

  describe('formatURL', () => {
    it('returns URL', () => {
      expect(formatURL(sourcesDataGraphQl[SOURCE_ENDPOINT_URL_INDEX])).toEqual('https://myopenshiftcluster.mycompany.com/');
    });
  });

  describe('defaultPort', () => {
    it('returns default port 80 for HTTP', () => {
      expect(defaultPort('http')).toEqual('80');
    });

    it('returns default port 443 for HTTPs', () => {
      expect(defaultPort('https')).toEqual('443');
    });

    it('returns undefined port 443 for uknown scheme', () => {
      expect(defaultPort('mttp')).toEqual(undefined);
    });
  });

  describe('schemaToPort', () => {
    it('correctly parses port', () => {
      expect(schemaToPort('https', 444)).toEqual(':444');
    });

    it('correctly parses string port', () => {
      expect(schemaToPort('https', '444')).toEqual(':444');
    });

    it('correctly parses default port', () => {
      expect(schemaToPort('https', 443)).toEqual('');
    });

    it('correctly parses undefined port', () => {
      expect(schemaToPort('https', undefined)).toEqual('');
    });
  });

  describe('importsTexts', () => {
    it('returns object for cfme', () => {
      expect(
        mount(wrapperWithIntl(importsTexts('cfme')))
          .children()
          .first()
      ).toEqual(expect.any(Object));
    });

    it('returns object for CFME', () => {
      expect(
        mount(wrapperWithIntl(importsTexts('CFME')))
          .children()
          .first()
      ).toEqual(expect.any(Object));
    });

    it('returns default undefined', () => {
      expect(
        mount(wrapperWithIntl(importsTexts('nonsense')))
          .children()
          .first()
      ).toEqual({});
    });
  });

  describe('endpointToUrl', () => {
    let endpoint;
    const CUSTOM_PORT = 123456789;

    beforeEach(() => {
      endpoint = {
        scheme: 'https',
        port: 443,
        path: '/',
        host: 'my.best.page',
      };
    });

    it('returns undefined when there are no positive values', () => {
      endpoint = {
        scheme: null,
        port: undefined,
        path: false,
        host: '',
      };

      expect(endpointToUrl(endpoint)).toEqual(undefined);
    });

    it('correctly parses URL with default port', () => {
      expect(endpointToUrl(endpoint)).toEqual('https://my.best.page/');
    });

    it('correctly parses URL with custom port', () => {
      expect(endpointToUrl({ ...endpoint, port: CUSTOM_PORT })).toEqual(`https://my.best.page:${CUSTOM_PORT}/`);
    });

    it('correctly parses this specific endpoint', () => {
      endpoint = { id: '123', scheme: 'https', host: 'redhat.com' };

      expect(endpointToUrl(endpoint)).toEqual('https://redhat.com');
    });
  });

  describe('availability status', () => {
    const APPTYPES = applicationTypesData.data;

    describe('getStatusColor', () => {
      it('returns OK color', () => {
        expect(getStatusColor(AVAILABLE)).toEqual('green');
      });

      it('returns WARNING color', () => {
        expect(getStatusColor(PARTIALLY_UNAVAILABLE)).toEqual('orange');
      });

      it('returns DANGER color', () => {
        expect(getStatusColor(UNAVAILABLE)).toEqual('red');
      });

      it('returns unknown color by default', () => {
        expect(getStatusColor(null)).toEqual('grey');
      });
    });

    describe('getStatusText', () => {
      it('returns OK text', () => {
        const wrapper = mount(wrapperWithIntl(getStatusText('available')));

        expect(wrapper.text()).toEqual('Available');
      });

      it('returns WARNING text', () => {
        const wrapper = mount(wrapperWithIntl(getStatusText('partially_available')));

        expect(wrapper.text()).toEqual('Partially available');
      });

      it('returns DANGER text', () => {
        const wrapper = mount(wrapperWithIntl(getStatusText('unavailable')));

        expect(wrapper.text()).toEqual('Unavailable');
      });

      it('returns unknown by default', () => {
        const wrapper = mount(wrapperWithIntl(getStatusText('some nonsense')));

        expect(wrapper.text()).toEqual('Unknown');
      });
    });

    describe('getStatusTooltipText', () => {
      const ERRORMESSAGE = 'some error';
      const ERRORMESSAGE2 = 'different type of error';

      it('returns OK text', () => {
        const wrapper = mount(wrapperWithIntl(getStatusTooltipText(AVAILABLE, APPTYPES)));

        expect(wrapper.text()).toEqual('Everything works fine.');
      });

      it('returns WARNING text', () => {
        const SOURCE_WITH_ERROR = {
          applications: [
            {
              id: COSTMANAGEMENT_APP.id,
              error: ERRORMESSAGE,
            },
          ],
        };

        const wrapper = mount(wrapperWithIntl(getStatusTooltipText(PARTIALLY_UNAVAILABLE, APPTYPES, SOURCE_WITH_ERROR)));

        expect(wrapper.text().includes(ERRORMESSAGE)).toEqual(true);
        expect(wrapper.text().includes(COSTMANAGEMENT_APP.display_name)).toEqual(true);
      });

      it('returns DANGER text', () => {
        const SOURCE_WITH_ERRORS = {
          applications: [
            {
              id: COSTMANAGEMENT_APP.id,
              error: ERRORMESSAGE,
            },
            {
              id: CATALOG_APP.id,
              error: ERRORMESSAGE2,
            },
          ],
        };

        const wrapper = mount(wrapperWithIntl(getStatusTooltipText(UNAVAILABLE, APPTYPES, SOURCE_WITH_ERRORS)));

        expect(wrapper.text().includes(ERRORMESSAGE)).toEqual(true);
        expect(wrapper.text().includes(COSTMANAGEMENT_APP.display_name)).toEqual(true);

        expect(wrapper.text().includes(ERRORMESSAGE2)).toEqual(true);
        expect(wrapper.text().includes(CATALOG_APP.display_name)).toEqual(true);
      });

      it('returns unknown by default', () => {
        const wrapper = mount(wrapperWithIntl(getStatusTooltipText('some nonsense', APPTYPES)));

        expect(wrapper.text()).toEqual('Status has not been verified.');
      });
    });

    describe('availabilityFormatter', () => {
      it('returns OK text', () => {
        const SOURCE = {
          applications: [{ availability_status: AVAILABLE }],
        };

        const wrapper = mount(wrapperWithIntl(availabilityFormatter('', SOURCE, { appTypes: APPTYPES })));

        expect(wrapper.find(Label)).toHaveLength(1);
        expect(wrapper.text().includes('Available')).toEqual(true);
      });

      it('returns WARNING text', () => {
        const SOURCE = {
          availability_status: UNAVAILABLE,
          applications: [{ availability_status: AVAILABLE }],
        };

        const wrapper = mount(wrapperWithIntl(availabilityFormatter('', SOURCE, { appTypes: APPTYPES })));

        expect(wrapper.find(Label)).toHaveLength(1);
        expect(wrapper.text().includes('Partially available')).toEqual(true);
      });

      it('returns DANGER text', () => {
        const SOURCE = {
          applications: [{ availability_status: UNAVAILABLE }],
        };

        const wrapper = mount(wrapperWithIntl(availabilityFormatter('', SOURCE, { appTypes: APPTYPES })));

        expect(wrapper.find(Label)).toHaveLength(1);
        expect(wrapper.text().includes('Unavailable')).toEqual(true);
      });

      it('returns unknown by default', () => {
        const SOURCE = {};

        const wrapper = mount(wrapperWithIntl(availabilityFormatter('', SOURCE, { appTypes: APPTYPES })));

        expect(wrapper.find(Label)).toHaveLength(1);
        expect(wrapper.text().includes('Unknown')).toEqual(true);
      });
    });

    describe('formatAvailibilityErrors', () => {
      const ERRORMESSAGE = 'some error';

      const SOURCE_WITH_ERROR = {
        applications: [
          {
            id: COSTMANAGEMENT_APP.id,
            error: ERRORMESSAGE,
          },
        ],
      };

      it('returns application error', () => {
        const wrapper = mount(wrapperWithIntl(formatAvailibilityErrors(APPTYPES, SOURCE_WITH_ERROR)));

        expect(wrapper.text().includes(ERRORMESSAGE)).toEqual(true);
        expect(wrapper.text().includes(COSTMANAGEMENT_APP.display_name)).toEqual(true);
      });

      it('returns application error with unfound appnam', () => {
        const EMPTY_APP_TYPES = [];

        const wrapper = mount(wrapperWithIntl(formatAvailibilityErrors(EMPTY_APP_TYPES, SOURCE_WITH_ERROR)));

        expect(wrapper.text().includes(ERRORMESSAGE)).toEqual(true);
        expect(wrapper.text().includes(COSTMANAGEMENT_APP.display_name)).toEqual(false);
        expect(wrapper.text().includes(COSTMANAGEMENT_APP.id)).toEqual(true);
      });

      it('returns authentication errors', () => {
        const SOURCE_WITHAUTH_ERROR = {
          authentications: [
            {
              type: 'token',
              error: ERRORMESSAGE,
            },
          ],
        };

        const wrapper = mount(wrapperWithIntl(formatAvailibilityErrors(APPTYPES, SOURCE_WITHAUTH_ERROR)));

        expect(wrapper.text().includes(ERRORMESSAGE)).toEqual(true);
        expect(wrapper.text().includes('token')).toEqual(true);
      });

      it('returns endpoint errors', () => {
        const SOURCE_WITH_ENDPOINT_ERROR = {
          endpoint: ERRORMESSAGE,
        };

        const wrapper = mount(wrapperWithIntl(formatAvailibilityErrors(APPTYPES, SOURCE_WITH_ENDPOINT_ERROR)));

        expect(wrapper.text().includes(ERRORMESSAGE)).toEqual(true);
      });

      it('returns source errors', () => {
        const SOURCE_WITH_SOURCE_ERROR = {
          source: ERRORMESSAGE,
        };

        const wrapper = mount(wrapperWithIntl(formatAvailibilityErrors(APPTYPES, SOURCE_WITH_SOURCE_ERROR)));

        expect(wrapper.text().includes(ERRORMESSAGE)).toEqual(true);
      });
    });

    describe('getAllErrors', () => {
      const errorMsg = 'This is error msg';

      it('available source', () => {
        expect(getAllErrors({ availability_status: AVAILABLE })).toEqual({
          errors: {},
          status: AVAILABLE,
        });
      });

      it('available source with endpoint', () => {
        expect(
          getAllErrors({
            availability_status: AVAILABLE,
            endpoints: [{ availability_status: AVAILABLE }],
          })
        ).toEqual({
          errors: {},
          status: AVAILABLE,
        });
      });

      it('available source with endpoint - 2', () => {
        expect(
          getAllErrors({
            availability_status: '',
            endpoints: [{ availability_status: AVAILABLE }],
          })
        ).toEqual({
          errors: {},
          status: AVAILABLE,
        });
      });

      it('available source with authentications', () => {
        expect(
          getAllErrors({
            availability_status: AVAILABLE,
            endpoints: [
              {
                availability_status: AVAILABLE,
                authentications: [{ availability_status: AVAILABLE }],
              },
            ],
          })
        ).toEqual({
          errors: {},
          status: AVAILABLE,
        });
      });

      it('available source with apps', () => {
        expect(
          getAllErrors({
            availability_status: AVAILABLE,
            endpoints: [
              {
                availability_status: AVAILABLE,
                authentications: [{ availability_status: AVAILABLE }],
              },
            ],
            applications: [{ availability_status: AVAILABLE }, { availability_status: AVAILABLE }],
          })
        ).toEqual({
          errors: {},
          status: AVAILABLE,
        });
      });

      it('available source with apps - 2', () => {
        expect(
          getAllErrors({
            availability_status: AVAILABLE,
            endpoints: [
              {
                availability_status: AVAILABLE,
                authentications: [{ availability_status: AVAILABLE }],
              },
            ],
            applications: [{ availability_status: '' }, { availability_status: AVAILABLE }],
          })
        ).toEqual({
          errors: {},
          status: AVAILABLE,
        });
      });

      it('partially available source with endpoint', () => {
        expect(
          getAllErrors({
            availability_status: AVAILABLE,
            endpoints: [
              {
                availability_status: UNAVAILABLE,
                availability_status_error: errorMsg,
              },
            ],
          })
        ).toEqual({
          errors: { endpoint: errorMsg },
          status: PARTIALLY_UNAVAILABLE,
        });
      });

      it('partially available source with endpoint - no error', () => {
        expect(
          getAllErrors({
            availability_status: AVAILABLE,
            endpoints: [
              {
                availability_status: UNAVAILABLE,
                availability_status_error: '',
              },
            ],
          })
        ).toEqual({
          errors: { endpoint: <UnknownError /> },
          status: PARTIALLY_UNAVAILABLE,
        });
      });

      it('partially available source with endpoint - no error for source status', () => {
        expect(
          getAllErrors({
            availability_status: UNAVAILABLE,
            availability_status_error: '',
            endpoints: [{ availability_status: AVAILABLE }],
          })
        ).toEqual({
          errors: { source: <UnknownError /> },
          status: PARTIALLY_UNAVAILABLE,
        });
      });

      it('partially available source with unavailable source', () => {
        expect(
          getAllErrors({
            availability_status: UNAVAILABLE,
            availability_status_error: errorMsg,
            endpoints: [{ availability_status: AVAILABLE }],
          })
        ).toEqual({
          errors: { source: errorMsg },
          status: PARTIALLY_UNAVAILABLE,
        });
      });

      it('partially available source with authentications', () => {
        expect(
          getAllErrors({
            availability_status: AVAILABLE,
            endpoints: [
              {
                availability_status: AVAILABLE,
                authentications: [
                  {
                    authtype: 'token',
                    availability_status: UNAVAILABLE,
                    availability_status_error: errorMsg,
                  },
                ],
              },
            ],
          })
        ).toEqual({
          errors: { authentications: [{ type: 'token', error: errorMsg }] },
          status: PARTIALLY_UNAVAILABLE,
        });
      });

      it('partially available source with authentications - 2', () => {
        expect(
          getAllErrors({
            availability_status: AVAILABLE,
            endpoints: [
              {
                availability_status: '',
                authentications: [
                  {
                    authtype: 'token',
                    availability_status: UNAVAILABLE,
                    availability_status_error: errorMsg,
                  },
                ],
              },
            ],
          })
        ).toEqual({
          errors: { authentications: [{ type: 'token', error: errorMsg }] },
          status: PARTIALLY_UNAVAILABLE,
        });
      });

      it('partially available source with multiple authentications', () => {
        expect(
          getAllErrors({
            availability_status: AVAILABLE,
            endpoints: [
              {
                availability_status: '',
                authentications: [
                  {
                    authtype: 'token',
                    availability_status: UNAVAILABLE,
                    availability_status_error: errorMsg,
                  },
                  {
                    authtype: 'lojza',
                    availability_status: UNAVAILABLE,
                    availability_status_error: undefined,
                  },
                ],
              },
            ],
          })
        ).toEqual({
          errors: {
            authentications: [
              { type: 'token', error: errorMsg },
              { type: 'lojza', error: <UnknownError /> },
            ],
          },
          status: PARTIALLY_UNAVAILABLE,
        });
      });

      it('partially available source with apps', () => {
        expect(
          getAllErrors({
            availability_status: AVAILABLE,
            endpoints: [
              {
                availability_status: AVAILABLE,
                authentications: [{ availability_status: AVAILABLE }],
              },
            ],
            applications: [
              { availability_status: AVAILABLE },
              {
                application_type_id: '151',
                availability_status: UNAVAILABLE,
                availability_status_error: errorMsg,
              },
            ],
          })
        ).toEqual({
          errors: { applications: [{ id: '151', error: errorMsg }] },
          status: PARTIALLY_UNAVAILABLE,
        });
      });

      it('unavailable available source with endpoint', () => {
        expect(
          getAllErrors({
            availability_status: UNAVAILABLE,
            availability_status_error: errorMsg,
            endpoints: [
              {
                availability_status: UNAVAILABLE,
                availability_status_error: errorMsg,
              },
            ],
          })
        ).toEqual({
          errors: { endpoint: errorMsg, source: errorMsg },
          status: UNAVAILABLE,
        });
      });

      it('unavailable available source with unavailable source', () => {
        expect(
          getAllErrors({
            availability_status: '',
            availability_status_error: errorMsg,
            endpoints: [
              {
                availability_status: UNAVAILABLE,
                availability_status_error: errorMsg,
              },
            ],
          })
        ).toEqual({
          errors: { endpoint: errorMsg },
          status: UNAVAILABLE,
        });
      });

      it('unavailable source with authentications', () => {
        expect(
          getAllErrors({
            availability_status: '',
            endpoints: [
              {
                availability_status: '',
                authentications: [
                  {
                    authtype: 'token',
                    availability_status: UNAVAILABLE,
                    availability_status_error: errorMsg,
                  },
                ],
              },
            ],
          })
        ).toEqual({
          errors: { authentications: [{ type: 'token', error: errorMsg }] },
          status: UNAVAILABLE,
        });
      });

      it('unavailable source with apps', () => {
        expect(
          getAllErrors({
            availability_status: '',
            endpoints: [
              {
                availability_status: '',
                authentications: [{ availability_status: '' }],
              },
            ],
            applications: [
              { availability_status: '' },
              {
                application_type_id: '151',
                availability_status: UNAVAILABLE,
                availability_status_error: errorMsg,
              },
            ],
          })
        ).toEqual({
          errors: { applications: [{ id: '151', error: errorMsg }] },
          status: UNAVAILABLE,
        });
      });

      it('unavailable source with multiple apps', () => {
        expect(
          getAllErrors({
            availability_status: '',
            endpoints: [
              {
                availability_status: '',
                authentications: [{ availability_status: '' }],
              },
            ],
            applications: [
              {
                application_type_id: '151',
                availability_status: UNAVAILABLE,
                availability_status_error: errorMsg,
              },
              {
                application_type_id: '5646',
                availability_status: UNAVAILABLE,
                availability_status_error: undefined,
              },
            ],
          })
        ).toEqual({
          errors: {
            applications: [
              { id: '151', error: errorMsg },
              { id: '5646', error: <UnknownError /> },
            ],
          },
          status: UNAVAILABLE,
        });
      });
    });
  });
});
