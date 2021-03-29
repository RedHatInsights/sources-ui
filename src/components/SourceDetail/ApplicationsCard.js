import React from 'react';
import { useIntl } from 'react-intl';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Card } from '@patternfly/react-core/dist/esm/components/Card/Card';
import { CardBody } from '@patternfly/react-core/dist/esm/components/Card/CardBody';
import { CardTitle } from '@patternfly/react-core/dist/esm/components/Card/CardTitle';
import { Switch } from '@patternfly/react-core/dist/esm/components/Switch/Switch';
import { FormGroup } from '@patternfly/react-core/dist/esm/components/Form/FormGroup';

import { useSource } from '../../hooks/useSource';
import { replaceRouteId, routes } from '../../Routes';
import { useHasWritePermissions } from '../../hooks/useHasWritePermissions';
import ApplicationStatusLabel from './ApplicationStatusLabel';
import { APP_NAMES } from '../SourceEditForm/parser/application';
import filterApps from '../../addSourceWizard/utilities/filterApps';

const descriptionMapper = (name, intl) =>
  ({
    [APP_NAMES.COST_MANAGAMENT]: intl.formatMessage({
      id: 'cost.app.description',
      defaultMessage: 'Analyze, forecast, and optimize your Red Hat OpenShift cluster costs in hybrid cloud environments.',
    }),
    [APP_NAMES.CLOUD_METER]: intl.formatMessage({
      id: 'cost.app.description',
      defaultMessage:
        'Includes access to Red Hat Gold Images, high precision subscription watch data, autoregistration, and Red Hat Connector.',
    }),
  }[name]);

const ApplicationsCard = () => {
  const intl = useIntl();
  const source = useSource();
  const { push } = useHistory();
  const sourceTypes = useSelector(({ sources }) => sources.sourceTypes, shallowEqual);
  const appTypes = useSelector(({ sources }) => sources.appTypes, shallowEqual);
  const hasRightAccess = useHasWritePermissions();

  const sourceType = sourceTypes.find((type) => type.id === source.source_type_id);
  const sourceTypeName = sourceType?.name;
  const filteredAppTypes = appTypes.filter((type) => type.supported_source_types.includes(sourceTypeName)).filter(filterApps);

  return (
    <Card className="card applications-card pf-u-p-lg pf-u-pl-sm-on-md">
      <CardTitle>
        {intl.formatMessage({
          id: 'detail.applications.title',
          defaultMessage: 'Applications',
        })}
      </CardTitle>
      <CardBody>
        {!hasRightAccess && (
          <div className="pf-u-mb-md" id="no-permissions-applications">
            {intl.formatMessage({
              id: 'sources.notAdminButton',
              defaultMessage:
                'To perform this adding/removing applications, you must be granted write permissions from your Organization Administrator.',
            })}
          </div>
        )}
        <div className="pf-c-form">
          {filteredAppTypes.map((app) => {
            const connectedApp = source.applications.find((connectedApp) => connectedApp.application_type_id === app.id);
            const description = descriptionMapper(app.name, intl);

            return (
              <FormGroup key={app.id}>
                <Switch
                  id={`app-switch-${app.id}`}
                  label={app.display_name}
                  isChecked={Boolean(connectedApp)}
                  isDisabled={connectedApp?.isDeleting || !hasRightAccess}
                  onChange={(value) =>
                    !value
                      ? push(replaceRouteId(routes.sourcesDetailRemoveApp.path, source.id).replace(':app_id', connectedApp.id))
                      : push(replaceRouteId(routes.sourcesDetailAddApp.path, source.id).replace(':app_type_id', app.id))
                  }
                />
                {Boolean(connectedApp) && <ApplicationStatusLabel app={connectedApp} />}
                {description && (
                  <div className="pf-c-switch pf-u-mt-sm">
                    <span className="pf-c-switch__toggle ins-c-sources__hide-me" />
                    <div className="pf-c-switch__label ins-c-sources__switch-description">{description}</div>
                  </div>
                )}
              </FormGroup>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
};

export default ApplicationsCard;
