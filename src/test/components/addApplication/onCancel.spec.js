import * as actions from '../../../redux/sources/actions';
import { onCancelAddApplication } from '../../../components/AddApplication/onCancel';
import { replaceRouteId, routes } from '../../../Routes';

describe('AddApplication - on cancel', () => {
    let args;

    beforeEach(() => {
        args = {
            values: { some_value: 'aa', application: { application_type_id: '12' } },
            intl: {
                formatMessage: ({ defaultMessage }) => defaultMessage
            },
            dispatch: jest.fn(),
            history: {
                push: jest.fn()
            },
            sourceId: '1554654654'
        };

        actions.addMessage = jest.fn();
        actions.clearAddSource = jest.fn();
    });

    it('create notifications when values and application id', () => {
        const tmpDate = Date.now;

        const TIMESTAMP = 12345313512;

        Date.now = () => TIMESTAMP;

        const EXPECTED_TITLE = expect.any(String);
        const EXPECTED_VARIANT = expect.any(String);
        const EXPECTED_DEESCRIPTION = expect.any(Object);
        const EXPECTED_CUSTOM_ID = TIMESTAMP;

        onCancelAddApplication(args);

        expect(actions.addMessage).toHaveBeenCalledWith(
            EXPECTED_TITLE,
            EXPECTED_VARIANT,
            EXPECTED_DEESCRIPTION,
            EXPECTED_CUSTOM_ID
        );
        expect(actions.clearAddSource).toHaveBeenCalled();
        expect(args.history.push).toHaveBeenCalledWith(routes.sources.path);

        expect(actions.addMessage.mock.calls[0][2].props.values.undo.props.path)
        .toEqual(replaceRouteId(routes.sourceManageApps.path, args.sourceId));

        Date.now = tmpDate;
    });

    it('only clear and change path when no application', () => {
        onCancelAddApplication({ ...args, values: { name: 'smith' } });

        expect(actions.addMessage).not.toHaveBeenCalled();
        expect(actions.clearAddSource).toHaveBeenCalled();
        expect(args.history.push).toHaveBeenCalledWith(routes.sources.path);
    });

    it('only clear and change path when undefined application', () => {
        onCancelAddApplication({ ...args, values: { application: undefined } });

        expect(actions.addMessage).not.toHaveBeenCalled();
        expect(actions.clearAddSource).toHaveBeenCalled();
        expect(args.history.push).toHaveBeenCalledWith(routes.sources.path);
    });
});
