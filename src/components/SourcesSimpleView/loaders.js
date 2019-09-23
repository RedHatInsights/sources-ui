import React from 'react';
import PropTypes from 'prop-types';
import ContentLoader from 'react-content-loader';
import { RowWrapper } from '@patternfly/react-table';

export const RowLoader = props => (
    <ContentLoader
        height={20}
        width={480}
        {...props}
    >
        <rect x="30" y="0" rx="3" ry="3" width="250" height="7" />
        <rect x="300" y="0" rx="3" ry="3" width="70" height="7" />
        <rect x="385" y="0" rx="3" ry="3" width="95" height="7" />
        <rect x="50" y="12" rx="3" ry="3" width="80" height="7" />
        <rect x="150" y="12" rx="3" ry="3" width="200" height="7" />
        <rect x="360" y="12" rx="3" ry="3" width="120" height="7" />
        <rect x="0" y="0" rx="0" ry="0" width="20" height="20" />
    </ContentLoader>
);

export const PlaceHolderTable = () => (
    <table className="sources-placeholder-table pf-m-compact ins-entity-table">
        <tbody>
            <tr><td><RowLoader /></td></tr>
            <tr><td><RowLoader /></td></tr>
        </tbody>
    </table>
);

export const RowWrapperLoader = ({ row: { isDeleting, ...row }, ...initialProps }) => (
    isDeleting ? <tr><td colSpan="5"><RowLoader /></td></tr> : <RowWrapper {...initialProps} row={row}/>
);

RowWrapperLoader.propTypes = {
    row: PropTypes.object.isRequired
};
