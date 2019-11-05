import {
    formatters,
    defaultFormatter,
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
    importsTexts
} from '../../../components/SourcesSimpleView/formatters';
import { sourceTypesData, OPENSHIFT_ID, AMAZON_ID, OPENSHIFT_INDEX } from '../../sourceTypesData';
import { sourcesDataGraphQl, SOURCE_CATALOGAPP_INDEX, SOURCE_ALL_APS_INDEX, SOURCE_NO_APS_INDEX, SOURCE_ENDPOINT_URL_INDEX } from '../../sourcesData';
import { applicationTypesData, CATALOG_INDEX, TOPOLOGICALINVENTORY_INDEX, COSTMANAGEMENET_INDEX } from '../../applicationTypesData';
import { componentWrapperIntl } from '../../../Utilities/testsHelpers';
import { Badge, Tooltip } from '@patternfly/react-core';

describe('formatters', () => {
    describe('formatters', () => {
        it('returns nameFormatter', () => {
            expect(formatters('nameFormatter')).toEqual(nameFormatter);
        });

        it('returns dateFormatter', () => {
            expect(formatters('dateFormatter')).toEqual(dateFormatter);
        });

        it('returns sourceTypeFormatter', () => {
            expect(formatters('sourceTypeFormatter')).toEqual(sourceTypeFormatter);
        });

        it('returns applicationFormatter', () => {
            expect(formatters('applicationFormatter')).toEqual(applicationFormatter);
        });

        it('returns importedFormatter', () => {
            expect(formatters('importedFormatter')).toEqual(importedFormatter);
        });

        it('returns defaultFormatter when non-sense', () => {
            const nonsenseFormatter = 'peknaKravina';
            const value = 'some value';
            expect(formatters(nonsenseFormatter)(value)).toEqual(`undefined ${nonsenseFormatter} formatter of value: ${value}`);
        });
    });

    describe('defaultFormatter', () => {
        it('returns string message', () => {
            const VALUE = 'ahoj';
            const NAME = 'dateFormatter';

            const result = defaultFormatter(NAME)(VALUE);

            expect(result.includes(NAME)).toEqual(true);
            expect(result.includes(VALUE)).toEqual(true);
        });
    });

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
            expect(sourceTypeFormatter(OPENSHIFT_ID, undefined, { sourceTypes: sourceTypesData.data })).toEqual(sourceTypesData.data.find(x => x.id === OPENSHIFT_ID).product_name);
        });

        it('returns type when there is no product_name', () => {
            expect(sourceTypeFormatter(OPENSHIFT_ID, undefined, { sourceTypes: [{ ...sourceTypesData.data[OPENSHIFT_INDEX], product_name: undefined }] })).toEqual(OPENSHIFT_ID);
        });

        it('returns empty string when no sourceType', () => {
            expect(sourceTypeFormatter(undefined, undefined, { sourceTypes: sourceTypesData.data })).toEqual('');
        });
    });

    describe('dateFormatter', () => {
        it('returns parsed date', () => {
            expect(dateFormatter(sourcesDataGraphQl[0].created_at)).toEqual('23 Apr 2019, 06:21 UTC');
        });
    });

    describe('nameFormatter', () => {
        it('returns name', () => {
            expect(JSON.stringify(nameFormatter(sourcesDataGraphQl[0].name, sourcesDataGraphQl[0], { sourceTypes: sourceTypesData.data }))
            .includes(sourcesDataGraphQl[0].name))
            .toEqual(true);
        });
    });

    describe('importedFormatter', () => {
        it('returns null when undefined value', () => {
            expect(importedFormatter(undefined)).toEqual(null);
        });

        it('returns only imported badge', () => {
            const wrapper = mount(componentWrapperIntl(importedFormatter('value with no text'), {}));

            expect(wrapper.find(Badge)).toHaveLength(1);
            expect(wrapper.find(Tooltip)).toHaveLength(0);
        });

        it('returns imported badge with tooltip', () => {
            const wrapper = mount(componentWrapperIntl(importedFormatter('cfme'), {}));

            expect(wrapper.find(Badge)).toHaveLength(1);
            expect(wrapper.find(Tooltip)).toHaveLength(1);
        });
    });

    describe('applicationFormatter', () => {
        it('returns full application list', () => {
            const result = JSON.stringify(applicationFormatter(sourcesDataGraphQl[SOURCE_ALL_APS_INDEX].applications, undefined, { appTypes: applicationTypesData.data }));

            expect(result.includes(applicationTypesData.data[CATALOG_INDEX].display_name)).toEqual(true);
            expect(result.includes(applicationTypesData.data[COSTMANAGEMENET_INDEX].display_name)).toEqual(true);
            expect(result.includes(applicationTypesData.data[TOPOLOGICALINVENTORY_INDEX].display_name)).toEqual(true);
        });

        it('returns empty application list', () => {
            const EMPTY_LIST_PLACEHOLDER = '--';
            const result = JSON.stringify(applicationFormatter(sourcesDataGraphQl[SOURCE_NO_APS_INDEX].applications, undefined, { appTypes: applicationTypesData.data }));

            expect(result.includes(applicationTypesData.data[CATALOG_INDEX].display_name)).toEqual(false);
            expect(result.includes(applicationTypesData.data[COSTMANAGEMENET_INDEX].display_name)).toEqual(false);
            expect(result.includes(applicationTypesData.data[TOPOLOGICALINVENTORY_INDEX].display_name)).toEqual(false);
            expect(result.includes(EMPTY_LIST_PLACEHOLDER)).toEqual(true);
        });

        it('returns application list with one item (catalog)', () => {
            const result = JSON.stringify(applicationFormatter(sourcesDataGraphQl[SOURCE_CATALOGAPP_INDEX].applications, undefined, { appTypes: applicationTypesData.data }));

            expect(result.includes(applicationTypesData.data[CATALOG_INDEX].display_name)).toEqual(true);
            expect(result.includes(applicationTypesData.data[COSTMANAGEMENET_INDEX].display_name)).toEqual(false);
            expect(result.includes(applicationTypesData.data[TOPOLOGICALINVENTORY_INDEX].display_name)).toEqual(false);
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
            expect(importsTexts('cfme')).toEqual(expect.any(Object));
        });

        it('returns object for CFME', () => {
            expect(importsTexts('CFME')).toEqual(expect.any(Object));
        });

        it('returns default undefined', () => {
            expect(importsTexts('nonsense')).toEqual(undefined);
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
                host: 'my.best.page'
            };
        });

        it('correctly parses URL with default port', () => {
            expect(endpointToUrl(endpoint)).toEqual('https://my.best.page/');
        });

        it('correctly parses URL with custom port', () => {
            expect(endpointToUrl({ ...endpoint, port: CUSTOM_PORT })).toEqual(`https://my.best.page:${CUSTOM_PORT}/`);
        });
    });
});
