import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Route } from 'react-router-dom';

import * as actions from '../../../redux/sources/actions';
import SourceRemoveModal from '../../../components/SourceRemoveModal/SourceRemoveModal';
import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import { sourcesDataGraphQl } from '../../__mocks__/sourcesData';
import { applicationTypesData, CATALOG_APP } from '../../__mocks__/applicationTypesData';
import { sourceTypesData, ANSIBLE_TOWER, SATELLITE, OPENSHIFT } from '../../__mocks__/sourceTypesData';

import { routes, replaceRouteId } from '../../../Routes';
import mockStore from '../../__mocks__/mockStore';

describe('SourceRemoveModal', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      sources: {
        entities: sourcesDataGraphQl,
        appTypes: applicationTypesData.data,
        sourceTypes: sourceTypesData.data,
      },
    });
  });

  describe('source with no application', () => {
    it('renders correctly', () => {
      render(
        componentWrapperIntl(
          <Route path={routes.sourcesRemove.path} render={(...args) => <SourceRemoveModal {...args} />} />,
          store,
          [replaceRouteId(routes.sourcesRemove.path, '14')]
        )
      );

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      expect([...screen.getAllByRole('button')].map((e) => e.textContent || e.getAttribute('aria-label'))).toEqual([
        'Close',
        'Remove source and its data',
        'Cancel',
      ]);
      expect(screen.getByText('Remove source and its data')).toBeDisabled();
    });

    it('enables submit button', async () => {
      render(
        componentWrapperIntl(
          <Route path={routes.sourcesRemove.path} render={(...args) => <SourceRemoveModal {...args} />} />,
          store,
          [replaceRouteId(routes.sourcesRemove.path, '14')]
        )
      );

      expect(screen.getByText('Remove source and its data')).toBeDisabled();

      await userEvent.click(screen.getByRole('checkbox'));

      expect(screen.getByText('Remove source and its data')).not.toBeDisabled();
    });

    it('calls submit action', async () => {
      actions.removeSource = jest.fn().mockImplementation(() => ({ type: 'REMOVE' }));

      render(
        componentWrapperIntl(
          <Route path={routes.sourcesRemove.path} render={(...args) => <SourceRemoveModal {...args} />} />,
          store,
          [replaceRouteId(routes.sourcesRemove.path, '14')]
        )
      );

      await userEvent.click(screen.getByRole('checkbox'));
      await userEvent.click(screen.getByText('Remove source and its data'));

      const source = sourcesDataGraphQl.find((s) => s.id === '14');

      expect(screen.getByTestId('location-display').textContent).toEqual(routes.sources.path);
      expect(actions.removeSource).toHaveBeenCalledWith('14', `${source.name} was deleted successfully.`); // calls removeSource with id of the source and right message
    });
  });

  describe('source with applications', () => {
    it('renders correctly', () => {
      render(
        componentWrapperIntl(
          <Route path={routes.sourcesRemove.path} render={(...args) => <SourceRemoveModal {...args} />} />,
          store,
          [replaceRouteId(routes.sourcesRemove.path, '406')]
        )
      );

      const source = sourcesDataGraphQl.find((s) => s.id === '406');
      const application = applicationTypesData.data.find((app) => app.id === source.applications[0].application_type_id);

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      expect([...screen.getAllByRole('button')].map((e) => e.textContent || e.getAttribute('aria-label'))).toEqual([
        'Close',
        'Remove source and its data',
        'Cancel',
      ]);
      expect(screen.getByText('Remove source and its data')).toBeDisabled();
      expect(screen.getByText(application.display_name)).toBeInTheDocument();
    });

    it('renders correctly when app is being deleted', () => {
      store = mockStore({
        sources: {
          entities: [
            {
              ...sourcesDataGraphQl.find((s) => s.id === '406'),
              applications: [
                {
                  ...sourcesDataGraphQl.find((s) => s.id === '406').applications,
                  isDeleting: true,
                },
              ],
            },
          ],
          appTypes: applicationTypesData.data,
          sourceTypes: sourceTypesData.data,
        },
      });

      render(
        componentWrapperIntl(
          <Route path={routes.sourcesRemove.path} render={(...args) => <SourceRemoveModal {...args} />} />,
          store,
          [replaceRouteId(routes.sourcesRemove.path, '406')]
        )
      );

      const source = sourcesDataGraphQl.find((s) => s.id === '406');
      const application = applicationTypesData.data.find((app) => app.id === source.applications[0].application_type_id);

      expect(() => screen.getByText(application.display_name)).toThrow();
    });

    it('renders correctly - ansible tower', () => {
      store = mockStore({
        sources: {
          entities: [
            {
              id: '406',
              name: 'Source pokus',
              source_type_id: ANSIBLE_TOWER.id,
              applications: [
                {
                  id: 'someid',
                  application_type_id: CATALOG_APP.id,
                },
              ],
            },
          ],
          appTypes: applicationTypesData.data,
          sourceTypes: sourceTypesData.data,
        },
      });

      render(
        componentWrapperIntl(
          <Route path={routes.sourcesRemove.path} render={(...args) => <SourceRemoveModal {...args} />} />,
          store,
          [replaceRouteId(routes.sourcesRemove.path, '406')]
        )
      );

      expect(
        screen.getByText('detaches the following connected application from this source:', { exact: false })
      ).toBeInTheDocument();
    });

    it('renders correctly - satellite', () => {
      store = mockStore({
        sources: {
          entities: [
            {
              id: '406',
              name: 'Source pokus',
              source_type_id: SATELLITE.id,
              applications: [
                {
                  id: 'someid',
                  application_type_id: CATALOG_APP.id,
                },
              ],
            },
          ],
          appTypes: applicationTypesData.data,
          sourceTypes: sourceTypesData.data,
        },
      });

      render(
        componentWrapperIntl(
          <Route path={routes.sourcesRemove.path} render={(...args) => <SourceRemoveModal {...args} />} />,
          store,
          [replaceRouteId(routes.sourcesRemove.path, '406')]
        )
      );

      expect(
        screen.getByText('detaches the following connected application from this source:', { exact: false })
      ).toBeInTheDocument();
    });

    it('renders correctly - openshift', () => {
      store = mockStore({
        sources: {
          entities: [
            {
              id: '406',
              name: 'Source pokus',
              source_type_id: OPENSHIFT.id,
              applications: [
                {
                  id: 'someid',
                  application_type_id: CATALOG_APP.id,
                },
              ],
            },
          ],
          appTypes: applicationTypesData.data,
          sourceTypes: sourceTypesData.data,
        },
      });

      render(
        componentWrapperIntl(
          <Route path={routes.sourcesRemove.path} render={(...args) => <SourceRemoveModal {...args} />} />,
          store,
          [replaceRouteId(routes.sourcesRemove.path, '406')]
        )
      );

      expect(
        screen.getByText('permanently deletes all collected data and detaches the following connected', { exact: false })
      ).toBeInTheDocument();
    });
  });
});
