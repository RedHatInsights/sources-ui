import React from 'react';
import PropTypes from 'prop-types';
import { RowWrapper } from '@patternfly/react-table';
import { Spinner } from '@patternfly/react-core/dist/js/components/Spinner';
import { Bullseye } from '@patternfly/react-core/dist/js/layouts/Bullseye';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/components/cjs/PageHeader';
import { Section } from '@redhat-cloud-services/frontend-components/components/cjs/Section';

import { COLUMN_COUNT } from '../../views/sourcesViewDefinition';

import './loaders.scss';
import { useIntl } from 'react-intl';

export const Loader = ({ width = '100%', height = '100%', className = '' }) => (
    <span className={ `ins-c-sources__loader ${className}` } style={ { width, height } }/>
);

Loader.propTypes = {
    className: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export const AppPlaceholder = () => {
    const intl = useIntl();

    return (
        <React.Fragment>
            <PageHeader>
                <PageHeaderTitle title={intl.formatMessage({
                    id: 'sources.sources',
                    defaultMessage: 'Sources'
                })}/>
            </PageHeader>
            <Section type='content'>
                <div className="ins-c-sources__fake_content pf-u-p-lg">
                    <Loader />
                </div>
            </Section>
        </React.Fragment>
    );
};

export const PaginationLoader = () => <Loader className="top-pagination" height={30} width={200}/>;

export const PlaceHolderTable = () => (
    <Bullseye className="ins-c-sources__sources-placeholder-loader">
        <Spinner size="xl"/>
    </Bullseye>
);

export const RowWrapperLoader = ({ row: { isDeleting, ...row }, ...initialProps }) => (isDeleting ?
    <tr><td colSpan={COLUMN_COUNT} className="pf-u-p-md"><Loader height={100}/></td></tr> :
    <RowWrapper {...initialProps} row={row} className='ins-c-sources__row-vertical-centered'/>
);

RowWrapperLoader.propTypes = {
    row: PropTypes.object.isRequired
};
