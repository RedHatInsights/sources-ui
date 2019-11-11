import { refreshPage } from '../../../components/UndoButton/refreshPage';

describe('refresh page', () => {
    let index;
    let history;

    beforeEach(() => {
        index = 0;

        history = {
            push: jest.fn().mockImplementation(() => index++),
            goBack: jest.fn().mockImplementation(() => index--)
        };
    });

    it('refresh the page', () => {
        refreshPage(history);

        expect(index).toEqual(0);
        expect(history.push).toHaveBeenCalled();
        expect(history.goBack).toHaveBeenCalled();
    });
});
