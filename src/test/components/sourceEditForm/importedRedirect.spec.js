import { redirectWhenImported } from '../../../components/SourceEditForm/importedRedirect';
import * as actions from '../../../redux/sources/actions';
import { paths } from '../../../Routes';

describe('redirectWhenImported', () => {
    const DISPATCH = jest.fn();
    const INTL = {
        formatMessage: jest.fn().mockImplementation(({ defaultMessage }) => defaultMessage)
    };
    const HISTORY = {
        push: jest.fn()
    };
    const NAME = 'imported source';

    const EXPECT_TITLE =  expect.any(String);
    const EXPECT_DESCRIPTION =  expect.any(String);

    it('add a notification and redirects to root', () => {
        actions.addMessage = jest.fn().mockImplementation();

        redirectWhenImported(DISPATCH, INTL, HISTORY, NAME);

        expect(DISPATCH).toHaveBeenCalled();
        expect(actions.addMessage).toHaveBeenCalledWith(
            EXPECT_TITLE,
            'danger',
            EXPECT_DESCRIPTION,
        );
        expect(HISTORY.push).toHaveBeenCalledWith(paths.sources);
    });
});
