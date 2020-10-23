import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { useSource } from '../../hooks/useSource';

import { Modal } from '@patternfly/react-core/dist/js/components/Modal';
import { ActionGroup } from '@patternfly/react-core/dist/js/components/Form/ActionGroup';
import { Button } from '@patternfly/react-core/dist/js/components/Button';

import { routes } from '../../Routes';
import Header from './Header';

export const FakeFooter = () => {
    const intl = useIntl();
    const history = useHistory();

    return (<div className="pf-c-form">
        <ActionGroup className="pf-u-mt-0">
            <Button variant="primary" isDisabled>
                {intl.formatMessage({
                    id: 'sources.save',
                    defaultMessage: 'Save'
                })}
            </Button>
            <Button variant="secondary" isDisabled>
                {intl.formatMessage({
                    id: 'sources.reset',
                    defaultMessage: 'Reset'
                })}
            </Button>
            <Button variant="link" onClick={() => history.push(routes.sources.path)}>
                {intl.formatMessage({
                    id: 'sources.cancel',
                    defaultMessage: 'Cancel'
                })}
            </Button>
        </ActionGroup>
    </div>);
};

const WrapperModal = ({ children }) => {
    const history = useHistory();
    const sourceRedux = useSource();
    const intl = useIntl();

    return (
        <Modal
            aria-label={intl.formatMessage({
                id: 'sources.editSource',
                defaultMessage: 'Edit source.'
            })}
            header={<Header name={sourceRedux.name} />}
            variant="large"
            isOpen={true}
            onClose={() => history.push(routes.sources.path)}
            footer={<FakeFooter />}
        >
            {children}
        </Modal>
    );
};

WrapperModal.propTypes = {
    children: PropTypes.node.isRequired
};

export default WrapperModal;
