import {
    formatters,
    defaultFormatter,
    nameFormatter,
    dateFormatter,
    sourceTypeFormatter,
    applicationFormatter,
    formatURL,
    sourceIsOpenShift
} from '../../../components/SourcesSimpleView/formatters';
import { sourceTypesData, OPENSHIFT_ID, AMAZON_ID, OPENSHIFT_INDEX } from '../../sourceTypesData';
import { sourcesDataGraphQl, SOURCE_CATALOGAPP_INDEX, SOURCE_ALL_APS_INDEX, SOURCE_NO_APS_INDEX, SOURCE_ENDPOINT_URL_INDEX } from '../../sourcesData';
import { applicationTypesData, CATALOG_INDEX, TOPOLOGICALINVENTORY_INDEX, COSTMANAGEMENET_INDEX } from '../../applicationTypesData';

describe('formatters', () => {
    describe('formatters', () => {
        it('returns nameFormatter', () => {
            expect(formatters('nameFormatter')).toEqual(nameFormatter);
        });

        it('returns dateFormatter', () => {
            expect(formatters('dateFormatter')).toEqual(dateFormatter);
        });

        it('returns nameFormatter', () => {
            expect(formatters('sourceTypeFormatter')).toEqual(sourceTypeFormatter);
        });

        it('returns nameFormatter', () => {
            expect(formatters('applicationFormatter')).toEqual(applicationFormatter);
        });

        it('returns nameFormatter', () => {
            expect(formatters('nameFormatter')).toEqual(nameFormatter);
        });

        it('returns defaultFormatter when non-sense', () => {
            expect(formatters('peknaKravina')).toEqual(defaultFormatter);
        });
    });

    describe('defaultFormatter', () => {
        it('returns value in string', () => {
            expect(defaultFormatter('ahoj').includes('ahoj')).toEqual(true);
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

    describe('applicationFormatter', () => {
        it('returns full application list', () => {
            const result = JSON.stringify(applicationFormatter(sourcesDataGraphQl[SOURCE_ALL_APS_INDEX].applications, undefined, { appTypes: applicationTypesData.data }));

            expect(result.includes(applicationTypesData.data[CATALOG_INDEX].display_name)).toEqual(true);
            expect(result.includes(applicationTypesData.data[COSTMANAGEMENET_INDEX].display_name)).toEqual(true);
            expect(result.includes(applicationTypesData.data[TOPOLOGICALINVENTORY_INDEX].display_name)).toEqual(true);
        });

        it('returns empty application list', () => {
            const result = JSON.stringify(applicationFormatter(sourcesDataGraphQl[SOURCE_NO_APS_INDEX].applications, undefined, { appTypes: applicationTypesData.data }));

            expect(result.includes(applicationTypesData.data[CATALOG_INDEX].display_name)).toEqual(false);
            expect(result.includes(applicationTypesData.data[COSTMANAGEMENET_INDEX].display_name)).toEqual(false);
            expect(result.includes(applicationTypesData.data[TOPOLOGICALINVENTORY_INDEX].display_name)).toEqual(false);
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
            expect(formatURL(sourcesDataGraphQl[SOURCE_ENDPOINT_URL_INDEX])).toEqual('https://myopenshiftcluster.mycompany.com:null/');
        });
    });
});
