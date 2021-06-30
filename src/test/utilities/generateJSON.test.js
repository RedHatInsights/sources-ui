import generateJSON from '../../utilities/generateJSON';
import applicationTypesData from '../__mocks__/applicationTypesData';
import { JSON_FILE } from '../__mocks__/fileMocks';
import { sourcesDataGraphQl } from '../__mocks__/sourcesData';
import sourceTypesData from '../__mocks__/sourceTypesData';

describe('generateCSV', () => {
  const INTL = { formatMessage: ({ defaultMessage }) => defaultMessage };

  it('generates CSV file', () => {
    expect(JSON.parse(generateJSON(sourcesDataGraphQl, INTL, applicationTypesData.data, sourceTypesData.data))).toEqual(
      JSON_FILE
    );
  });
});
