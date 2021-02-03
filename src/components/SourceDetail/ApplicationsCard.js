import React from 'react';
import { useIntl } from 'react-intl';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Card } from '@patternfly/react-core/dist/esm/components/Card/Card';
import { CardBody } from '@patternfly/react-core/dist/esm/components/Card/CardBody';
import { CardTitle } from '@patternfly/react-core/dist/esm/components/Card/CardTitle';
import { Switch } from '@patternfly/react-core/dist/esm/components/Switch/Switch';
import { FormGroup } from '@patternfly/react-core/dist/esm/components/Form/FormGroup';

import filterApps from '@redhat-cloud-services/frontend-components-sources/esm/filterApps';

import { useSource } from '../../hooks/useSource';
import { replaceRouteId, routes } from '../../Routes';
import { useHasWritePermissions } from '../../hooks/useHasWritePermissions';
import ApplicationStatusLabel from './ApplicationStatusLabel';

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
              </FormGroup>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
};

export default ApplicationsCard;
