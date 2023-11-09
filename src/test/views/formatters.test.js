import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  AVAILABLE,
  ApplicationLabel,
  IN_PROGRESS,
  PARTIALLY_UNAVAILABLE,
  PAUSED,
  UNAVAILABLE,
  UnknownError,
  applicationFormatter,
  availabilityFormatter,
  configurationModeFormatter,
  dateFormatter,
  defaultPort,
  endpointToUrl,
  formatAvailibilityErrors,
  formatURL,
  getAllErrors,
  getStatusColor,
  getStatusText,
  getStatusTooltipText,
  importedFormatter,
  importsTexts,
  nameFormatter,
  schemaToPort,
  sourceIsOpenShift,
  sourceTypeFormatter,
} from '../../views/formatters';
import sourceTypes, { AMAZON_TYPE, OPENSHIFT_TYPE } from '../__mocks__/sourceTypes';
import { ACCOUNT_AUTHORIZATION, MANUAL_CONFIGURATION } from '../../components/constants';
import {
  SOURCE_ALL_APS_INDEX,
  SOURCE_CATALOGAPP_INDEX,
  SOURCE_ENDPOINT_URL_INDEX,
  SOURCE_NO_APS_INDEX,
  sourcesDataGraphQl,
} from '../__mocks__/sourcesData';
import appTypes, { CATALOG_APP, COST_MANAGEMENT_APP, TOPOLOGY_INV_APP } from '../__mocks__/applicationTypes';

import { IntlProvider } from 'react-intl';
import { componentWrapperIntl } from '../../utilities/testsHelpers';
import { MemoryRouter } from 'react-router-dom';
import { replaceRouteId, routes } from '../../Routing';

jest.mock('@patternfly/react-icons/dist/esm/icons/pause-icon', () => ({
  __esModule: true,
  default: () => <span>pause icon</span>,
}));
jest.mock('@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon', () => ({
  __esModule: true,
  default: () => <span>exclamation icon</span>,
}));
jest.mock('@patternfly/react-icons/dist/esm/icons/wrench-icon', () => ({
  __esModule: true,
  default: () => <span>wrench icon</span>,
}));

describe('formatters', () => {
  const wrapperWithIntl = (children) => <IntlProvider locale="en">{children}</IntlProvider>;

  describe('sourceIsOpenShift', () => {
    it('returns true when is openshift', () => {
      expect(sourceIsOpenShift({ source_type_id: OPENSHIFT_TYPE.id }, sourceTypes)).toEqual(true);
    });

    it('returns false when is not openshift', () => {
      expect(sourceIsOpenShift({ source_type_id: AMAZON_TYPE.id }, sourceTypes)).toEqual(false);
    });
  });

  describe('sourceTypeFormatter', () => {
    it('returns product_name (OpenShift)', () => {
      expect(
        sourceTypeFormatter(OPENSHIFT_TYPE.id, undefined, {
          sourceTypes,
        }),
      ).toEqual(sourceTypes.find((x) => x.id === OPENSHIFT_TYPE.id).product_name);
    });

    it('returns type when there is no product_name', () => {
      expect(
        sourceTypeFormatter(OPENSHIFT_TYPE.id, undefined, {
          sourceTypes: [
            {
              ...OPENSHIFT_TYPE,
              product_name: undefined,
            },
          ],
        }),
      ).toEqual(OPENSHIFT_TYPE.id);
    });

    it('returns empty string when no sourceType', () => {
      expect(
        sourceTypeFormatter(undefined, undefined, {
          sourceTypes,
        }),
      ).toEqual('');
    });
  });

  describe('dateFormatter', () => {
    it('returns parsed date', () => {
      Date.now = jest.fn().mockImplementation(() => '99999999999');

      render(dateFormatter(sourcesDataGraphQl[0].created_at));

      expect(screen.getByText('Just now')).toBeInTheDocument();
    });
  });

  describe('nameFormatter', () => {
    it('returns name', () => {
      expect(
        JSON.stringify(
          nameFormatter(sourcesDataGraphQl[0].name, sourcesDataGraphQl[0], {
            sourceTypes,
          }),
        ).includes(sourcesDataGraphQl[0].name),
      ).toEqual(true);
    });
  });

  describe('importedFormatter', () => {
    it('returns null when undefined value', () => {
      expect(importedFormatter(undefined)).toEqual(null);
    });

    it('returns only imported badge', () => {
      render(<IntlProvider locale="en">{importedFormatter('value with no text')}</IntlProvider>);

      expect(screen.getByText('imported', { selector: '.pf-v5-c-badge' })).toBeInTheDocument();
    });

    it('returns imported badge with tooltip', async () => {
      const user = userEvent.setup();

      render(<IntlProvider locale="en">{importedFormatter('cfme')}</IntlProvider>);

      expect(screen.getByText('imported', { selector: '.pf-v5-c-badge' })).toBeInTheDocument();

      await waitFor(async () => {
        await user.hover(screen.getByText('imported', { selector: '.pf-v5-c-badge' }));
      });

      await waitFor(() =>
        expect(screen.getByText('This source can be managed from your connected CloudForms application.')).toBeInTheDocument(),
      );
    });
  });

  describe('applicationFormatter', () => {
    it('returns full application list', async () => {
      const user = userEvent.setup();

      render(
        componentWrapperIntl(
          <React.Fragment>
            {applicationFormatter(sourcesDataGraphQl[SOURCE_ALL_APS_INDEX].applications, undefined, {
              appTypes,
            })}
          </React.Fragment>,
        ),
      );

      expect(screen.getByText(CATALOG_APP.display_name, { exact: false })).toBeInTheDocument();
      expect(screen.getByText(COST_MANAGEMENT_APP.display_name, { exact: false })).toBeInTheDocument();
      expect(screen.getByText('1 more', { exact: false })).toBeInTheDocument();

      await waitFor(async () => {
        await user.click(screen.getByText('1 more'));
      });

      expect(screen.getByText(TOPOLOGY_INV_APP.display_name, { exact: false })).toBeInTheDocument();
    });

    it('returns empty application list', () => {
      const EMPTY_LIST_PLACEHOLDER = '--';

      render(
        componentWrapperIntl(
          <React.Fragment>
            {applicationFormatter(sourcesDataGraphQl[SOURCE_NO_APS_INDEX].applications, undefined, {
              appTypes,
            })}
          </React.Fragment>,
        ),
      );

      expect(screen.getByText(EMPTY_LIST_PLACEHOLDER, { exact: false })).toBeInTheDocument();
    });

    it('returns application list with one item (catalog)', () => {
      render(
        componentWrapperIntl(
          <React.Fragment>
            {applicationFormatter(sourcesDataGraphQl[SOURCE_CATALOGAPP_INDEX].applications, undefined, {
              appTypes,
            })}
          </React.Fragment>,
        ),
      );

      expect(screen.getByText(CATALOG_APP.display_name, { exact: false })).toBeInTheDocument();
    });

    it('show available popover', async () => {
      const user = userEvent.setup();

      render(
        componentWrapperIntl(
          <React.Fragment>
            {applicationFormatter(
              [
                {
                  application_type_id: COST_MANAGEMENT_APP.id,
                  availability_status: AVAILABLE,
                },
              ],
              undefined,
              {
                appTypes,
              },
            )}
          </React.Fragment>,
        ),
      );

      await waitFor(async () => {
        await user.click(screen.getByText('Cost Management'));
      });

      await waitFor(() => expect(screen.getByText('Everything works fine.', { exact: false })).toBeInTheDocument());
    });

    it('show unavailable popover', async () => {
      const user = userEvent.setup();

      const ERROR = 'some error';
      render(
        componentWrapperIntl(
          <React.Fragment>
            {applicationFormatter(
              [
                {
                  application_type_id: COST_MANAGEMENT_APP.id,
                  availability_status: UNAVAILABLE,
                  availability_status_error: ERROR,
                },
              ],
              undefined,
              {
                appTypes,
              },
            )}
          </React.Fragment>,
        ),
      );

      await waitFor(async () => {
        await user.click(screen.getByText('Cost Management'));
      });

      await waitFor(() => expect(screen.getByText(ERROR, { exact: false })).toBeInTheDocument());
    });

    it('show unavailable popover - endpoint error', async () => {
      const user = userEvent.setup();

      const ERROR = 'some error';
      render(
        componentWrapperIntl(
          <React.Fragment>
            {applicationFormatter(
              [
                {
                  application_type_id: COST_MANAGEMENT_APP.id,
                  availability_status: null,
                  authentications: [{ resource_type: 'Endpoint' }],
                },
              ],
              { endpoints: [{ availability_status: UNAVAILABLE, availability_status_error: ERROR }] },
              {
                appTypes,
              },
            )}
          </React.Fragment>,
        ),
      );

      await waitFor(async () => {
        await user.click(screen.getByText('Cost Management'));
      });

      await waitFor(() => expect(screen.getByText(ERROR, { exact: false })).toBeInTheDocument());
    });

    it('show in progress label', async () => {
      const user = userEvent.setup();

      render(
        componentWrapperIntl(
          <React.Fragment>
            {applicationFormatter(
              [
                {
                  application_type_id: COST_MANAGEMENT_APP.id,
                  availability_status: IN_PROGRESS,
                  availability_status_error: null,
                },
              ],
              undefined,
              {
                appTypes,
              },
            )}
          </React.Fragment>,
        ),
      );

      await waitFor(async () => {
        await user.click(screen.getByText('Cost Management'));
      });

      await waitFor(() =>
        expect(
          screen.getByText('We are still working to validate credentials. Check back for status updates.'),
        ).toBeInTheDocument(),
      );
      expect(screen.getByText('wrench icon')).toBeInTheDocument();
    });

    it('show paused icon', async () => {
      const user = userEvent.setup();

      render(
        componentWrapperIntl(
          <React.Fragment>
            {applicationFormatter(
              [
                {
                  application_type_id: COST_MANAGEMENT_APP.id,
                  availability_status: IN_PROGRESS,
                  availability_status_error: null,
                  paused_at: 'today',
                },
              ],
              undefined,
              {
                appTypes,
              },
            )}
          </React.Fragment>,
        ),
      );

      await waitFor(async () => {
        await user.click(screen.getByText('Cost Management'));
      });

      await waitFor(() =>
        expect(screen.getByText('Resume this application to continue data collection.', { exact: false })).toBeInTheDocument(),
      );
      expect(screen.getByText('pause icon')).toBeInTheDocument();
    });

    it('show unavailable popover - unknown error', async () => {
      const user = userEvent.setup();

      render(
        componentWrapperIntl(
          <React.Fragment>
            {applicationFormatter(
              [
                {
                  application_type_id: COST_MANAGEMENT_APP.id,
                  availability_status: UNAVAILABLE,
                  availability_status_error: null,
                },
              ],
              undefined,
              {
                appTypes,
              },
            )}
          </React.Fragment>,
        ),
      );

      await waitFor(async () => {
        await user.click(screen.getByText('Cost Management'));
      });

      await waitFor(() => expect(screen.getByText('Unknown error')).toBeInTheDocument());
    });

    it('show unknown popover', async () => {
      const user = userEvent.setup();

      render(
        componentWrapperIntl(
          <React.Fragment>
            {applicationFormatter(
              [
                {
                  application_type_id: COST_MANAGEMENT_APP.id,
                  availability_status: null,
                  availability_status_error: null,
                },
              ],
              undefined,
              {
                appTypes,
              },
            )}
          </React.Fragment>,
        ),
      );

      await waitFor(async () => {
        await user.click(screen.getByText('Cost Management'));
      });

      await waitFor(() => expect(screen.getByText('Status has not been verified.')).toBeInTheDocument());
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
      render(wrapperWithIntl(importsTexts('cfme')));

      expect(screen.getByText('This source can be managed from your connected CloudForms application.')).toBeInTheDocument();
    });

    it('returns object for CFME', () => {
      render(wrapperWithIntl(importsTexts('CFME')));

      expect(screen.getByText('This source can be managed from your connected CloudForms application.')).toBeInTheDocument();
    });

    it('returns default undefined', () => {
      const { container } = render(wrapperWithIntl(importsTexts('nonsense')));

      expect(container.textContent).toEqual('');
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

      it('returns IN_PROGRESS color', () => {
        expect(getStatusColor(IN_PROGRESS)).toEqual('grey');
      });

      it('returns unknown color by default', () => {
        expect(getStatusColor(null)).toEqual('grey');
      });

      it('returns paused color', () => {
        expect(getStatusColor(PAUSED)).toEqual('cyan');
      });
    });

    describe('getStatusText', () => {
      it('returns OK text', () => {
        render(wrapperWithIntl(getStatusText('available')));

        expect(screen.getByText('Available')).toBeInTheDocument();
      });

      it('returns WARNING text', () => {
        render(wrapperWithIntl(getStatusText('partially_available')));

        expect(screen.getByText('Partially available')).toBeInTheDocument();
      });

      it('returns DANGER text', () => {
        render(wrapperWithIntl(getStatusText('unavailable')));

        expect(screen.getByText('Unavailable')).toBeInTheDocument();
      });

      it('returns OK text', () => {
        render(wrapperWithIntl(getStatusText('in_progress')));

        expect(screen.getByText('In progress')).toBeInTheDocument();
      });

      it('returns unknown by default', () => {
        render(wrapperWithIntl(getStatusText('some nonsense')));

        expect(screen.getByText('Unknown')).toBeInTheDocument();
      });

      it('returns unknown by default', () => {
        render(wrapperWithIntl(getStatusText('paused_at')));

        expect(screen.getByText('Paused')).toBeInTheDocument();
      });
    });

    describe('getStatusTooltipText', () => {
      const ERRORMESSAGE = 'some error';
      const ERRORMESSAGE2 = 'different type of error';

      it('returns OK text', () => {
        render(wrapperWithIntl(getStatusTooltipText(AVAILABLE, appTypes)));

        expect(screen.getByText('Everything works fine.')).toBeInTheDocument();
      });

      it('returns IN PROGRESS text', () => {
        render(wrapperWithIntl(getStatusTooltipText(IN_PROGRESS, appTypes)));

        expect(
          screen.getByText('We are still working to validate credentials. Check back for status updates.'),
        ).toBeInTheDocument();
      });

      it('returns WARNING text', () => {
        const SOURCE_WITH_ERROR = {
          applications: [
            {
              id: COST_MANAGEMENT_APP.id,
              error: ERRORMESSAGE,
            },
          ],
        };

        render(wrapperWithIntl(getStatusTooltipText(PARTIALLY_UNAVAILABLE, appTypes, SOURCE_WITH_ERROR)));

        expect(screen.getByText(ERRORMESSAGE, { exact: false })).toBeInTheDocument();
        expect(screen.getByText(COST_MANAGEMENT_APP.display_name, { exact: false })).toBeInTheDocument();
      });

      it('returns DANGER text', () => {
        const SOURCE_WITH_ERRORS = {
          applications: [
            {
              id: COST_MANAGEMENT_APP.id,
              error: ERRORMESSAGE,
            },
            {
              id: CATALOG_APP.id,
              error: ERRORMESSAGE2,
            },
          ],
        };

        render(wrapperWithIntl(getStatusTooltipText(UNAVAILABLE, appTypes, SOURCE_WITH_ERRORS)));

        expect(screen.getByText(ERRORMESSAGE, { exact: false })).toBeInTheDocument();
        expect(screen.getByText(COST_MANAGEMENT_APP.display_name, { exact: false })).toBeInTheDocument();

        expect(screen.getByText(ERRORMESSAGE2, { exact: false })).toBeInTheDocument();
        expect(screen.getByText(CATALOG_APP.display_name, { exact: false })).toBeInTheDocument();
      });

      it('returns unknown by default', () => {
        render(wrapperWithIntl(getStatusTooltipText('some nonsense', appTypes)));

        expect(screen.getByText('Status has not been verified.')).toBeInTheDocument();
      });

      it('returns paused text', () => {
        render(wrapperWithIntl(getStatusTooltipText(PAUSED, appTypes)));

        expect(
          screen.getByText('Data collection is temporarily disabled. Resume source to reestablish connection.'),
        ).toBeInTheDocument();
      });
    });

    describe('availabilityFormatter', () => {
      it('returns OK text', () => {
        const SOURCE = {
          applications: [{ availability_status: AVAILABLE }],
        };

        render(wrapperWithIntl(availabilityFormatter('', SOURCE, { appTypes, sourceTypes })));

        expect(screen.getByText('Available', { exact: false, selector: '.pf-v5-c-label__text' })).toBeInTheDocument();
      });

      it('returns WARNING text', () => {
        const SOURCE = {
          availability_status: UNAVAILABLE,
          applications: [{ availability_status: AVAILABLE }],
        };

        render(wrapperWithIntl(availabilityFormatter('', SOURCE, { appTypes, sourceTypes })));

        expect(screen.getByText('Partially available', { exact: false, selector: '.pf-v5-c-label__text' })).toBeInTheDocument();
      });

      it('returns DANGER text', () => {
        const SOURCE = {
          applications: [{ availability_status: UNAVAILABLE }],
        };

        render(wrapperWithIntl(availabilityFormatter('', SOURCE, { appTypes, sourceTypes })));

        expect(screen.getByText('Unavailable', { exact: false, selector: '.pf-v5-c-label__text' })).toBeInTheDocument();
      });

      it('returns in progress text', () => {
        const SOURCE = {
          availability_status: IN_PROGRESS,
        };

        render(wrapperWithIntl(availabilityFormatter('', SOURCE, { appTypes, sourceTypes })));

        expect(screen.getByText('In progress', { exact: false, selector: '.pf-v5-c-label__text' })).toBeInTheDocument();
        expect(screen.getByText('wrench icon')).toBeInTheDocument();
      });

      it('returns unknown by default', () => {
        const SOURCE = {};

        render(wrapperWithIntl(availabilityFormatter('', SOURCE, { appTypes, sourceTypes })));

        expect(screen.getByText('Unknown', { exact: false, selector: '.pf-v5-c-label__text' })).toBeInTheDocument();
      });

      it('returns paused text', () => {
        const SOURCE = {
          availability_status: IN_PROGRESS,
          paused_at: 'today',
        };

        render(wrapperWithIntl(availabilityFormatter('', SOURCE, { appTypes, sourceTypes })));

        expect(screen.getByText('Paused', { exact: false, selector: '.pf-v5-c-label__text' })).toBeInTheDocument();
        expect(screen.getByText('pause icon')).toBeInTheDocument();
      });
    });

    describe('formatAvailibilityErrors', () => {
      const ERRORMESSAGE = 'some error';

      const SOURCE_WITH_ERROR = {
        applications: [
          {
            id: COST_MANAGEMENT_APP.id,
            error: ERRORMESSAGE,
          },
        ],
      };

      it('returns application error', () => {
        render(wrapperWithIntl(formatAvailibilityErrors(appTypes, SOURCE_WITH_ERROR)));

        expect(screen.getByText(ERRORMESSAGE, { exact: false })).toBeInTheDocument();
        expect(screen.getByText(COST_MANAGEMENT_APP.display_name, { exact: false })).toBeInTheDocument();
      });

      it('returns application error with unfound appnam', () => {
        const EMPTY_APP_TYPES = [];

        render(wrapperWithIntl(formatAvailibilityErrors(EMPTY_APP_TYPES, SOURCE_WITH_ERROR)));

        expect(screen.getByText(ERRORMESSAGE, { exact: false })).toBeInTheDocument();
        expect(screen.getByText(COST_MANAGEMENT_APP.id, { exact: false })).toBeInTheDocument();
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

        render(wrapperWithIntl(formatAvailibilityErrors(appTypes, SOURCE_WITHAUTH_ERROR)));

        expect(screen.getByText(ERRORMESSAGE, { exact: false })).toBeInTheDocument();
        expect(screen.getByText('token', { exact: false })).toBeInTheDocument();
      });

      it('returns endpoint errors', () => {
        const SOURCE_WITH_ENDPOINT_ERROR = {
          endpoint: ERRORMESSAGE,
        };

        render(wrapperWithIntl(formatAvailibilityErrors(appTypes, SOURCE_WITH_ENDPOINT_ERROR)));

        expect(screen.getByText(ERRORMESSAGE, { exact: false })).toBeInTheDocument();
      });

      it('returns source errors', () => {
        const SOURCE_WITH_SOURCE_ERROR = {
          source: ERRORMESSAGE,
        };

        render(wrapperWithIntl(formatAvailibilityErrors(appTypes, SOURCE_WITH_SOURCE_ERROR)));

        expect(screen.getByText(ERRORMESSAGE, { exact: false })).toBeInTheDocument();
      });
    });

    describe('getAllErrors', () => {
      const errorMsg = 'This is error msg';

      it('in progress source', () => {
        expect(getAllErrors({ availability_status: IN_PROGRESS })).toEqual({
          errors: {},
          status: IN_PROGRESS,
        });
      });

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
          }),
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
          }),
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
          }),
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
          }),
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
          }),
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
          }),
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
          }),
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
          }),
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
          }),
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
          }),
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
          }),
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
          }),
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
          }),
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
          }),
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
          }),
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
          }),
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
          }),
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
          }),
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

  describe('configuration mode', () => {
    const INTL = { formatMessage: ({ defaultMessage }) => defaultMessage };
    const SOURCE_ID = 'some-source-id';

    it('account_authorization', () => {
      render(
        <MemoryRouter>
          {wrapperWithIntl(configurationModeFormatter(ACCOUNT_AUTHORIZATION, { id: SOURCE_ID }, { intl: INTL }))}
        </MemoryRouter>,
      );

      expect(screen.getByText('Edit credentials')).toBeInTheDocument();
    });

    it('account_authorization with paused source', () => {
      render(
        <MemoryRouter>
          {wrapperWithIntl(
            configurationModeFormatter(ACCOUNT_AUTHORIZATION, { id: SOURCE_ID, paused_at: 'today' }, { intl: INTL }),
          )}
        </MemoryRouter>,
      );

      expect(screen.getByText('View credentials')).toBeInTheDocument();
    });

    it('account_authorization with an error', async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter>
          {wrapperWithIntl(
            configurationModeFormatter(
              ACCOUNT_AUTHORIZATION,
              {
                id: SOURCE_ID,
                authentications: [
                  {
                    authtype: 'different type',
                    availability_status: UNAVAILABLE,
                    availability_status_error: 'some-error',
                  },
                  {
                    authtype: 'access_key_secret_key',
                    availability_status: UNAVAILABLE,
                    availability_status_error: 'Your username is wrong',
                  },
                ],
              },
              { intl: INTL, sourceType: AMAZON_TYPE },
            ),
          )}
        </MemoryRouter>,
      );

      expect(screen.getByText('Edit credentials', { selector: 'button' })).toBeInTheDocument();
      expect(screen.getByRole('link')).toHaveAttribute(
        'href',
        replaceRouteId(`/settings/integrations/${routes.sourcesDetailEditCredentials.path}`, SOURCE_ID),
      );

      await waitFor(async () => {
        await user.hover(screen.getByText('exclamation icon'));
      });

      await waitFor(() => expect(screen.getByText('Your username is wrong')).toBeInTheDocument());
    });

    it('account_authorization with default error', async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter>
          {wrapperWithIntl(
            configurationModeFormatter(
              ACCOUNT_AUTHORIZATION,
              {
                id: SOURCE_ID,
                authentications: [
                  {
                    authtype: 'access_key_secret_key',
                    availability_status: UNAVAILABLE,
                  },
                ],
              },
              { intl: INTL, sourceType: AMAZON_TYPE },
            ),
          )}
        </MemoryRouter>,
      );

      expect(screen.getByText('Edit credentials', { selector: 'button' })).toBeInTheDocument();

      await waitFor(async () => {
        await user.hover(screen.getByText('exclamation icon'));
      });

      await waitFor(() => expect(screen.getByText('Edit credentials required.')).toBeInTheDocument());
    });

    it('manual_configuration', () => {
      render(
        <MemoryRouter>
          {wrapperWithIntl(configurationModeFormatter(MANUAL_CONFIGURATION, { id: SOURCE_ID }, { intl: INTL }))}
        </MemoryRouter>,
      );

      expect(screen.getByText('Manual configuration', { selector: 'div' })).toBeInTheDocument();
    });
  });

  describe('ApplicationLabel', () => {
    it('renders paused', async () => {
      const user = userEvent.setup();

      const app = {
        display_name: 'Cost management',
        availability_status: AVAILABLE,
        availability_status_error: null,
        paused_at: 'today',
      };

      render(wrapperWithIntl(<ApplicationLabel app={app} />));

      expect(screen.getByText('Cost management').closest('.pf-v5-c-label')).toHaveClass('pf-m-green');
      await waitFor(async () => {
        await user.click(screen.getByText('Cost management'));
      });
      expect(screen.getByText('pause icon')).toBeInTheDocument();

      await waitFor(() => expect(screen.getByText('Application paused')).toBeInTheDocument());
      expect(screen.getByText('Everything works fine. Resume this application to continue data collection.')).toBeInTheDocument();
    });

    it('renders with status', () => {
      const app = {
        display_name: 'Cost management',
        availability_status: UNAVAILABLE,
        availability_status_error: null,
      };

      render(wrapperWithIntl(<ApplicationLabel app={app} showStatusText />));
      expect(screen.getByText('Unavailable')).toBeInTheDocument();
    });
  });
});
