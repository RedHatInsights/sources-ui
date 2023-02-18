import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { act, render, screen } from '@testing-library/react';

import Detail from '../../pages/Detail';
import * as RedirectNoId from '../../components/RedirectNoId/RedirectNoId';
import * as RedirectNoWriteAccess from '../../components/RedirectNoWriteAccess/RedirectNoWriteAccess';
import * as RedirectNoPaused from '../../components/RedirectNoPaused/RedirectNoPaused';
import * as ApplicationResourcesCard from '../../components/SourceDetail/ApplicationResourcesCard';
import * as ApplicationsCard from '../../components/SourceDetail/ApplicationsCard';
import * as SourceSummaryCard from '../../components/SourceDetail/SourceSummaryCard';
import * as DetailHeader from '../../components/SourceDetail/DetailHeader';
import { replaceRouteId, routes } from '../../Routing';
import componentWrapperIntl from '../../utilities/testsHelpers';
import mockStore from '../__mocks__/mockStore';
import CustomRoute from '../../components/CustomRoute/CustomRoute';

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
jest.mock('../../components/CredentialsForm/CredentialsForm', () => ({
  __esModule: true,
  default: () => <span>Credentials form</span>,
}));

jest.mock('react', () => {
  const React = jest.requireActual('react');
  const Suspense = ({ children }) => {
    return children;
  };

  const lazy = jest.fn().mockImplementation((fn) => {
    const Component = (props) => {
      const [C, setC] = React.useState();

      React.useEffect(() => {
        fn().then((v) => {
          setC(v);
        });
      }, []);

      return C ? <C.default {...props} /> : null;
    };

    return Component;
  });

  return {
    ...React,
    lazy,
    Suspense,
  };
});

describe('SourceDetail', () => {
  let store;

  const sourceId = '3627987';
  const initialEntry = [replaceRouteId(routes.sourcesDetail.path, sourceId)];

  beforeEach(() => {
    DetailHeader.default = () => <span>Header</span>;
    SourceSummaryCard.default = () => <span>Summary</span>;
    ApplicationsCard.default = () => <span>AppCard</span>;
    ApplicationResourcesCard.default = () => <span>ResourcesCard</span>;
    RedirectNoId.default = () => <span>Mock redirect no id</span>;
    RedirectNoWriteAccess.default = () => <span>Mock redirect no write access</span>;
    RedirectNoPaused.default = () => <span>Mock redirect no pause</span>;
  });

  it('renders loading', async () => {
    store = mockStore({
      sources: {
        entities: [],
      },
    });

    render(
      componentWrapperIntl(
        <Routes>
          <Route path={`${routes.sourcesDetail.path}/*`} element={<Detail />} />
        </Routes>,
        store,
        initialEntry
      )
    );

    expect(screen.getAllByRole('progressbar')).toHaveLength(4);
    expect(screen.getByText('Mock redirect no id')).toBeInTheDocument();
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

    render(
      componentWrapperIntl(
        <Routes>
          <Route path={`${routes.sourcesDetail.path}/*`} element={<Detail />} />
        </Routes>,
        store,
        initialEntry
      )
    );

    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('AppCard')).toBeInTheDocument();
    expect(screen.getByText('ResourcesCard')).toBeInTheDocument();

    expect(() => screen.getByText('Source paused')).toThrow();

    expect(() => screen.getByText('Remove Modal')).toThrow();
    expect(() => screen.getByText('Add application')).toThrow();
    expect(() => screen.getByText('Remove app')).toThrow();
    expect(() => screen.getByText('Rename')).toThrow();
    expect(() => screen.getByText('Credentials form')).toThrow();

    expect(() => screen.getByText('Mock redirect no id')).toThrow();
    expect(() => screen.getByText('Mock redirect no write access')).toThrow();
    expect(() => screen.getByText('Mock redirect no pause')).toThrow();
  });

  it('renders paused source', async () => {
    store = mockStore({
      sources: {
        entities: [
          {
            id: sourceId,
            paused_at: 'today',
          },
        ],
      },
      user: {},
    });

    render(
      componentWrapperIntl(
        <Routes>
          <Route path={`${routes.sourcesDetail.path}/*`} element={<Detail />} />
        </Routes>,
        store,
        initialEntry
      )
    );

    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('AppCard')).toBeInTheDocument();
    expect(screen.getByText('ResourcesCard')).toBeInTheDocument();

    expect(screen.getByText('Source paused')).toBeInTheDocument();

    expect(() => screen.getByText('Remove Modal')).toThrow();
    expect(() => screen.getByText('Add application')).toThrow();
    expect(() => screen.getByText('Remove app')).toThrow();
    expect(() => screen.getByText('Rename')).toThrow();
    expect(() => screen.getByText('Credentials form')).toThrow();

    expect(() => screen.getByText('Mock redirect no id')).toThrow();
    expect(() => screen.getByText('Mock redirect no write access')).toThrow();
    expect(() => screen.getByText('Mock redirect no pause')).toThrow();
  });

  describe('routes', () => {
    describe('loaded', () => {
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
        const initialEntry = ['/' + replaceRouteId(routes.sourcesDetailRemove.path, sourceId)];

        await act(async () => {
          render(
            componentWrapperIntl(
              <CustomRoute
                route={{ ...routes.sourcesDetail, writeAccess: true, path: routes.sourcesDetail.path + '/*' }}
                Component={Detail}
              />,
              store,
              initialEntry
            )
          );
        });

        expect(screen.getByText('Remove Modal')).toBeInTheDocument();
        expect(screen.getByText('Mock redirect no write access')).toBeInTheDocument();
        expect(() => screen.getByText('Mock redirect no pause')).toThrow();
      });

      it('routes to rename source', async () => {
        const initialEntry = ['/' + replaceRouteId(routes.sourcesDetailRename.path, sourceId)];

        await act(async () => {
          render(
            componentWrapperIntl(
              <CustomRoute
                route={{
                  ...routes.sourcesDetail,
                  writeAccess: true,
                  noPaused: true,
                  redirectNoId: true,
                  path: routes.sourcesDetail.path + '/*',
                }}
                Component={Detail}
              />,
              store,
              initialEntry
            )
          );
        });

        expect(screen.getByText('Rename')).toBeInTheDocument();
        expect(screen.getByText('Mock redirect no write access')).toBeInTheDocument();
        expect(screen.getByText('Mock redirect no pause')).toBeInTheDocument();
      });

      it('routes to add app', async () => {
        const initialEntry = [replaceRouteId(routes.sourcesDetailAddApp.path, sourceId).replace(':app_type_id', '2')];

        await act(async () => {
          render(
            componentWrapperIntl(
              <Routes>
                <Route path={`${routes.sourcesDetail.path}/*`} element={<Detail />} />
              </Routes>,
              store,
              initialEntry
            )
          );
        });

        expect(screen.getByText('Add application')).toBeInTheDocument();
        expect(screen.getByText('Mock redirect no write access')).toBeInTheDocument();
        expect(screen.getByText('Mock redirect no pause')).toBeInTheDocument();
      });

      it('routes to remove app', async () => {
        const initialEntry = [replaceRouteId(routes.sourcesDetailRemoveApp.path, sourceId).replace(':app_id', '344')];

        await act(async () => {
          render(
            componentWrapperIntl(
              <Routes>
                <Route path={`${routes.sourcesDetail.path}/*`} element={<Detail />} />
              </Routes>,
              store,
              initialEntry
            )
          );
        });

        expect(screen.getByText('Remove app')).toBeInTheDocument();
        expect(screen.getByText('Mock redirect no write access')).toBeInTheDocument();
        expect(screen.getByText('Mock redirect no pause')).toBeInTheDocument();
      });

      it('routes to credentials form', async () => {
        const initialEntry = [replaceRouteId(routes.sourcesDetailEditCredentials.path, sourceId)];

        await act(async () => {
          render(
            componentWrapperIntl(
              <CustomRoute
                route={{
                  ...routes.sourcesDetail,
                  writeAccess: true,
                  redirectNoId: true,
                  path: routes.sourcesDetail.path + '/*',
                }}
                Component={Detail}
              />,
              store,
              initialEntry
            )
          );
        });

        expect(screen.getByText('Credentials form')).toBeInTheDocument();
        expect(screen.getByText('Mock redirect no write access')).toBeInTheDocument();
        expect(() => screen.getByText('Mock redirect no pause')).toThrow();
      });
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
        const initialEntry = ['/' + replaceRouteId(routes.sourcesDetailRemove.path, sourceId)];

        await act(async () => {
          render(
            componentWrapperIntl(
              <Routes>
                <Route path={`${routes.sourcesDetail.path}/*`} element={<Detail />} />
              </Routes>,
              store,
              initialEntry
            )
          );
        });

        expect(screen.getByText('Mock redirect no id')).toBeInTheDocument();
      });

      it('routes to rename source', async () => {
        const initialEntry = [replaceRouteId(routes.sourcesDetailRename.path, sourceId)];

        await act(async () => {
          render(
            componentWrapperIntl(
              <Routes>
                <Route path={`${routes.sourcesDetail.path}/*`} element={<Detail />} />
              </Routes>,
              store,
              initialEntry
            )
          );
        });

        expect(screen.getByText('Mock redirect no id')).toBeInTheDocument();
      });

      it('routes to add app', async () => {
        const initialEntry = [replaceRouteId(routes.sourcesDetailAddApp.path, sourceId).replace(':app_type_id', '2')];

        await act(async () => {
          render(
            componentWrapperIntl(
              <Routes>
                <Route path={`${routes.sourcesDetail.path}/*`} element={<Detail />} />
              </Routes>,
              store,
              initialEntry
            )
          );
        });

        expect(screen.getByText('Mock redirect no id')).toBeInTheDocument();
      });

      it('routes to remove app', async () => {
        const initialEntry = [replaceRouteId(routes.sourcesDetailRemoveApp.path, sourceId).replace(':app_id', '344')];

        await act(async () => {
          render(
            componentWrapperIntl(
              <Routes>
                <Route path={`${routes.sourcesDetail.path}/*`} element={<Detail />} />
              </Routes>,
              store,
              initialEntry
            )
          );
        });

        expect(screen.getByText('Mock redirect no id')).toBeInTheDocument();
      });

      it('routes to credentials form', async () => {
        const initialEntry = [replaceRouteId(routes.sourcesDetailEditCredentials.path, sourceId)];

        await act(async () => {
          render(
            componentWrapperIntl(
              <Routes>
                <Route path={`${routes.sourcesDetail.path}/*`} element={<Detail />} />
              </Routes>,
              store,
              initialEntry
            )
          );
        });

        expect(screen.getByText('Mock redirect no id')).toBeInTheDocument();
      });
    });
  });
});
