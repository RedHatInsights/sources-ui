import SourcesListView from '../PresentationalComponents/SourcesListView/SourcesListView';

import configureStore from 'redux-mock-store';
//import { Provider } from 'react-redux';
import { sourcesTestData } from './sourcesData';

//beforeEach(function() {
//  global.fetch = jest.fn().mockImplementation(() => {
//      var p = new Promise((resolve, reject) => {
//        resolve({
//          ok: true,
//          Id: '123',
//          json: function() {
//            return {Id: '123'}
//          }
//        });
//      });
//      return p;
//  });
//});

describe('SourcesListView', () => {
    it('renders table and pagination', done => {
        const mockStore = configureStore([]);
        const store = mockStore({ providers: { rows: [], entities: [], numberOfEntities: 0 } });

        fetchMock
        .getOnce('/r/insights/platform/topological-inventory/v0.0/sources/', sourcesTestData);

        const listView = shallow(
            <SourcesListView store={store} columns={[]}/>
        ).dive();

        setImmediate(() => {
            expect(toJson(listView)).toMatchSnapshot();
            done();
        });
    });
});
