import React from 'react';
import { Route } from 'react-router-dom';
import { act } from 'react-dom/test-utils';

import { GridItem } from '@patternfly/react-core/dist/esm/layouts/Grid/GridItem';
import { Grid } from '@patternfly/react-core/dist/esm/layouts/Grid/Grid';

import Detail from '../../pages/Detail';
import { DetailLoader } from '../../components/SourcesTable/loaders';
import * as RedirectNoId from '../../components/RedirectNoId/RedirectNoId';
import * as RedirectNoWriteAccess from '../../components/RedirectNoWriteAccess/RedirectNoWriteAccess';
import CustomRoute from '../../components/CustomRoute/CustomRoute';
import * as ApplicationResourcesCard from '../../components/SourceDetail/ApplicationResourcesCard';
import * as ApplicationsCard from '../../components/SourceDetail/ApplicationsCard';
import * as SourceSummaryCard from '../../components/SourceDetail/SourceSummaryCard';
import * as DetailHeader from '../../components/SourceDetail/DetailHeader';
import { replaceRouteId, routes } from '../../Routes';
import componentWrapperIntl from '../../utilities/testsHelpers';
import * as SourceRemoveModal from '../../components/SourceRemoveModal/SourceRemoveModal';
import * as AddApplication from '../../components/AddApplication/AddApplication';
import * as RemoveAppModal from '../../components/AddApplication/RemoveAppModal';
import * as SourceRenameModal from '../../components/SourceDetail/SourceRenameModal';
import mockStore from '../__mocks__/mockStore';

jest.mock('../../components/SourceRemoveModal/SourceRemoveModal', () => ({
  __esModule: true,
  default: () => <span>Remove Modal</span>,
}));
jest.mock('../../components/AddApplication/AddApplication', () => ({
  __esModule: true,
  default: () => <span>Add application</span>,
}));
jest.mock('../../components/AddApplication/RemoveAppModal', () => ({
  __esModule: true,
  default: () => <span>Remove app</span>,
}));
jest.mock('../../components/SourceDetail/SourceRenameModal', () => ({
  __esModule: true,
  default: () => <span>Rename</span>,
}));

describe('SourceDetail', () => {
  let wrapper;
  let store;

  const sourceId = '3627987';
  const initialEntry = [replaceRouteId(routes.sourcesDetail.path, sourceId)];

  DetailHeader.default = () => <span>Header</span>;
  SourceSummaryCard.default = () => <span>Summary</span>;
  ApplicationsCard.default = () => <span>AppCard</span>;
  ApplicationResourcesCard.default = () => <span>ResourcesCard</span>;
  RedirectNoId.default = () => <span>Mock redirect</span>;
  RedirectNoWriteAccess.default = () => <span>Mock redirect</span>;

  it('renders loading', async () => {
    RedirectNoId.default = () => <span>Mock redirect</span>;

    store = mockStore({
      sources: {
        entities: [],
      },
    });

    wrapper = mount(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <Detail {...args} />} />,
        store,
        initialEntry
      )
    );

    expect(wrapper.find(DetailLoader)).toHaveLength(1);
    expect(wrapper.find(RedirectNoId.default)).toHaveLength(1);
  });

  it('renders correctly', async () => {
    store = mockStore({
      sources: {
        entities: [
          {
            id: sourceId,
          },
        ],
      },
    });

    wrapper = mount(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <Detail {...args} />} />,
        store,
        initialEntry
      )
    );

    expect(wrapper.find(Grid)).toHaveLength(1);
    expect(wrapper.find(GridItem)).toHaveLength(3);
    expect(wrapper.find(DetailHeader.default)).toHaveLength(1);
    expect(wrapper.find(SourceSummaryCard.default)).toHaveLength(1);
    expect(wrapper.find(ApplicationsCard.default)).toHaveLength(1);
    expect(wrapper.find(ApplicationResourcesCard.default)).toHaveLength(1);
    expect(wrapper.find(CustomRoute)).toHaveLength(4);
    expect(wrapper.find(SourceRemoveModal.default)).toHaveLength(0);
    expect(wrapper.find(AddApplication.default)).toHaveLength(0);
    expect(wrapper.find(RemoveAppModal.default)).toHaveLength(0);
    expect(wrapper.find(RedirectNoWriteAccess.default)).toHaveLength(0);
    expect(wrapper.find(RedirectNoId.default)).toHaveLength(0);
    expect(wrapper.find(SourceRenameModal.default)).toHaveLength(0);
  });

  describe('routes', () => {
    beforeEach(() => {
      store = mockStore({
        sources: {
          entities: [
            {
              id: sourceId,
            },
          ],
        },
      });
    });

    it('routes to remove source', async () => {
      const initialEntry = [replaceRouteId(routes.sourcesDetailRemove.path, sourceId)];

      await act(async () => {
        wrapper = mount(
          componentWrapperIntl(
            <Route path={routes.sourcesDetail.path} render={(...args) => <Detail {...args} />} />,
            store,
            initialEntry
          )
        );
      });
      wrapper.update();

      expect(wrapper.find(SourceRemoveModal.default)).toHaveLength(1);
      expect(wrapper.find(RedirectNoWriteAccess.default)).toHaveLength(1);
    });

    it('routes to rename source', async () => {
      const initialEntry = [replaceRouteId(routes.sourcesDetailRename.path, sourceId)];

      await act(async () => {
        wrapper = mount(
          componentWrapperIntl(
            <Route path={routes.sourcesDetail.path} render={(...args) => <Detail {...args} />} />,
            store,
            initialEntry
          )
        );
      });
      wrapper.update();

      expect(wrapper.find(SourceRenameModal.default)).toHaveLength(1);
      expect(wrapper.find(RedirectNoWriteAccess.default)).toHaveLength(1);
    });

    it('routes to add app', async () => {
      const initialEntry = [replaceRouteId(routes.sourcesDetailAddApp.path, sourceId).replace(':app_type_id', '2')];

      await act(async () => {
        wrapper = mount(
          componentWrapperIntl(
            <Route path={routes.sourcesDetail.path} render={(...args) => <Detail {...args} />} />,
            store,
            initialEntry
          )
        );
      });
      wrapper.update();

      expect(wrapper.find(AddApplication.default)).toHaveLength(1);
      expect(wrapper.find(RedirectNoWriteAccess.default)).toHaveLength(1);
    });

    it('routes to remove app', async () => {
      const initialEntry = [replaceRouteId(routes.sourcesDetailRemoveApp.path, sourceId).replace(':app_id', '344')];

      await act(async () => {
        wrapper = mount(
          componentWrapperIntl(
            <Route path={routes.sourcesDetail.path} render={(...args) => <Detail {...args} />} />,
            store,
            initialEntry
          )
        );
      });
      wrapper.update();

      expect(wrapper.find(RemoveAppModal.default)).toHaveLength(1);
      expect(wrapper.find(RedirectNoWriteAccess.default)).toHaveLength(1);
    });

    describe('unloaded', () => {
      beforeEach(() => {
        store = mockStore({
          sources: {
            entities: [],
          },
        });
      });

      it('routes to remove source', async () => {
        const initialEntry = [replaceRouteId(routes.sourcesDetailRemove.path, sourceId)];

        await act(async () => {
          wrapper = mount(
            componentWrapperIntl(
              <Route path={routes.sourcesDetail.path} render={(...args) => <Detail {...args} />} />,
              store,
              initialEntry
            )
          );
        });
        wrapper.update();

        expect(wrapper.find(RedirectNoId.default)).toHaveLength(1);
      });

      it('routes to rename source', async () => {
        const initialEntry = [replaceRouteId(routes.sourcesDetailRename.path, sourceId)];

        await act(async () => {
          wrapper = mount(
            componentWrapperIntl(
              <Route path={routes.sourcesDetail.path} render={(...args) => <Detail {...args} />} />,
              store,
              initialEntry
            )
          );
        });
        wrapper.update();

        expect(wrapper.find(RedirectNoId.default)).toHaveLength(1);
      });

      it('routes to add app', async () => {
        const initialEntry = [replaceRouteId(routes.sourcesDetailAddApp.path, sourceId).replace(':app_type_id', '2')];

        await act(async () => {
          wrapper = mount(
            componentWrapperIntl(
              <Route path={routes.sourcesDetail.path} render={(...args) => <Detail {...args} />} />,
              store,
              initialEntry
            )
          );
        });
        wrapper.update();

        expect(wrapper.find(RedirectNoId.default)).toHaveLength(1);
      });

      it('routes to remove app', async () => {
        const initialEntry = [replaceRouteId(routes.sourcesDetailRemoveApp.path, sourceId).replace(':app_id', '344')];

        await act(async () => {
          wrapper = mount(
            componentWrapperIntl(
              <Route path={routes.sourcesDetail.path} render={(...args) => <Detail {...args} />} />,
              store,
              initialEntry
            )
          );
        });
        wrapper.update();

        expect(wrapper.find(RedirectNoId.default)).toHaveLength(1);
      });
    });
  });
});
