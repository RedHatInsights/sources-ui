import { onSubmit } from '../../../components/SourceEditForm/onSubmit';
import * as actions from '../../../redux/sources/actions';
import { paths } from '../../../Routes';

describe('editSourceModal - on submit', () => {
    let VALUES;
    let EDITING;
    let DISPATCH;
    let SOURCE;
    let INTL;
    let PUSH;

    let formatMessageMock;

    beforeEach(() => {
        formatMessageMock = jest.fn().mockImplementation(({ defaultMessage }) => defaultMessage);

        VALUES = { source: {
            name: 'name',
            type: 'openshift'
        } };
        EDITING = {
            'source.type': true
        };
        DISPATCH = jest.fn().mockImplementation((func) => func);
        SOURCE = { source: {
            name: 'aaa'
        } };
        INTL = {
            formatMessage: formatMessageMock
        };
        PUSH = jest.fn();
    });

    afterEach(() => {
        DISPATCH.mockReset();
        PUSH.mockReset();
    });

    it('submit values successfuly', async () => {
        actions.updateSource = jest.fn().mockImplementation(() => Promise.resolve('OK'));
        actions.loadEntities = jest.fn();

        const FILTERED_VALUES = {
            source: {
                type: 'openshift'
            }
        };

        const EXPECTED_TRANSLATED_MESSAGE = expect.any(String);

        await onSubmit(
            VALUES,
            EDITING,
            DISPATCH,
            SOURCE,
            INTL,
            PUSH
        );

        expect(actions.updateSource).toHaveBeenCalledWith(
            SOURCE,
            FILTERED_VALUES,
            EXPECTED_TRANSLATED_MESSAGE,
            EXPECTED_TRANSLATED_MESSAGE,
            {
                authentication: EXPECTED_TRANSLATED_MESSAGE,
                source: EXPECTED_TRANSLATED_MESSAGE,
                endpoint: EXPECTED_TRANSLATED_MESSAGE,
                costManagement: EXPECTED_TRANSLATED_MESSAGE
            }
        );
        expect(PUSH).toHaveBeenCalledWith(paths.sources);
        expect(actions.loadEntities).toHaveBeenCalled();
    });

    it('submit values unsuccessfuly', async () => {
        actions.updateSource = jest.fn().mockImplementation(() => Promise.reject('FAILS'));
        actions.loadEntities = jest.fn();

        expect.assertions(2);

        try {
            await onSubmit(
                VALUES,
                EDITING,
                DISPATCH,
                SOURCE,
                INTL,
                PUSH
            );
        } catch {
            expect(PUSH).not.toHaveBeenCalled();
            expect(actions.loadEntities).not.toHaveBeenCalled();
        }
    });
});
