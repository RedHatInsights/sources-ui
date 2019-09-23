import React, { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link, withRouter, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { TableToolbar, PageHeader, PageHeaderTitle, Pagination, Section } from '@redhat-cloud-services/frontend-components';
import {
    filterProviders,
    loadAppTypes,
    loadEntities,
    loadSourceTypes,
    setProviderFilterColumn
} from '../redux/actions/providers';
import { Button } from '@patternfly/react-core';
import { SplitItem, Split } from '@patternfly/react-core';
import filter from 'lodash/filter';
import { FormattedMessage, injectIntl } from 'react-intl';
import { AddSourceWizard } from '@redhat-cloud-services/frontend-components-sources';

import SourcesSimpleView from '../components/SourcesSimpleView/SourcesSimpleView';
import SourcesFilter from '../components/SourcesFilter';
import SourcesEmptyState from '../components/SourcesEmptyState';
import SourceEditModal from '../components/SourceEditForm/SourceEditModal';
import SourceRemoveModal from '../components/SourceRemoveModal';
import AddApplication from '../components/AddApplication/AddApplication';
import { sourcesViewDefinition } from '../views/sourcesViewDefinition';
import { pageAndSize } from '../redux/actions/providers';
import { paths } from '../Routes';
import { prepareEntities } from '../Utilities/filteringSorting';

const SourcesPage = ({
    entities,
    others,
    filterValue,
    numberOfEntities,
    pageSize,
    pageNumber,
    sourceTypes,
    appTypes,
    history,
    loadEntities,
    intl,
    match,
    location,
    loaded,
    fetchingError,
    loadSourceTypes,
    loadAppTypes,
    filterProviders,
    pageAndSize,
    setProviderFilterColumn
}) => {
    useEffect(() => {
        Promise.all([loadSourceTypes(), loadAppTypes(), loadEntities()]);
    }, []);

    const onSetPage = (number) => pageAndSize(number, pageSize);

    const onPerPageSelect = (count) => pageAndSize(1, count);

    const numberOfFilteredEntities = (
        filterValue && filterValue !== '' ?
            prepareEntities(entities, { ...others, filterValue, pageSize, pageNumber }).length
            : numberOfEntities
    );

    const maximumPageNumber = (numberOfFilteredEntities / pageSize) + 1;
    const currentPage = pageNumber > maximumPageNumber ? maximumPageNumber : pageNumber;

    const mainContent = () => (
        <React.Fragment>
            <TableToolbar xresults={numberOfFilteredEntities}>
                <Split gutter="md" style={{ flexGrow: 1 }}>
                    <SplitItem>
                        <SourcesFilter
                            columns={filter(sourcesViewDefinition.columns(intl), c => c.searchable)}
                            onFilter={filterProviders}
                            onFilterSelect={(_component, column) => setProviderFilterColumn(column.value)}/>
                    </SplitItem>
                    <SplitItem>
                        <Link to={paths.sourcesNew}>
                            <Button variant='primary'>
                                <FormattedMessage
                                    id="sources.addSource"
                                    defaultMessage="Add a source"
                                />
                            </Button>
                        </Link>
                    </SplitItem>
                    <SplitItem style={{ flexGrow: 1 }}>
                        <Pagination
                            itemsPerPage={pageSize}
                            page={currentPage}
                            direction='down'
                            onSetPage={onSetPage}
                            onPerPageSelect={onPerPageSelect}
                            numberOfItems={numberOfFilteredEntities || 0}
                        />
                    </SplitItem>
                </Split>
            </TableToolbar>
            <SourcesSimpleView columns={sourcesViewDefinition.columns(intl)}/>
            <TableToolbar>
                <Pagination
                    itemsPerPage={pageSize}
                    page={currentPage}
                    direction='up'
                    onSetPage={onSetPage}
                    onPerPageSelect={onPerPageSelect}
                    numberOfItems={numberOfFilteredEntities || 0}
                />
            </TableToolbar>
        </React.Fragment>
    );

    const noEntities = !numberOfFilteredEntities || numberOfFilteredEntities === 0;
    const displayEmptyState = loaded && !filterValue && noEntities;

    const editorNew = location.pathname === paths.sourcesNew;
    const editorEdit = match.path === paths.sourcesEdit;

    return (
        <React.Fragment>
            <Route exact path={paths.sourceManageApps} component={ AddApplication } />
            <Route exact path={paths.sourcesRemove} component={ SourceRemoveModal } />
            { editorNew && <AddSourceWizard
                sourceTypes={sourceTypes}
                applicationTypes={appTypes}
                isOpen={true}
                onClose={() => history.push('/')}
                afterSuccess={() => loadEntities()}
                hideSourcesButton={true}
            />}
            { editorEdit && <SourceEditModal />}
            <PageHeader>
                <PageHeaderTitle title={intl.formatMessage({
                    id: 'sources.sources',
                    defaultMessage: 'Sources'
                })}/>
            </PageHeader>
            <Section type='content'>
                { (displayEmptyState || fetchingError) ?
                    <SourcesEmptyState
                        title={fetchingError ? fetchingError.title : undefined}
                        body={fetchingError ? fetchingError.detail : undefined}
                    />
                    :
                    mainContent()}
            </Section>
        </React.Fragment>
    );
};

SourcesPage.propTypes = {
    filterProviders: PropTypes.func.isRequired,
    setProviderFilterColumn: PropTypes.func.isRequired,
    loadEntities: PropTypes.func.isRequired,
    loadSourceTypes: PropTypes.func.isRequired,
    loadAppTypes: PropTypes.func.isRequired,
    pageAndSize: PropTypes.func.isRequired,
    sourceTypes: PropTypes.array,
    appTypes: PropTypes.array,
    entities: PropTypes.array,
    others: PropTypes.object,
    numberOfEntities: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    pageNumber: PropTypes.number.isRequired,
    fetchingError: PropTypes.object,

    filterValue: PropTypes.string,
    loaded: PropTypes.bool.isRequired,

    location: PropTypes.any.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.any.isRequired,

    intl: PropTypes.object.isRequired
};

SourcesPage.defaultProps = {
    sourceTypes: undefined
};

const mapDispatchToProps = dispatch => bindActionCreators(
    {
        filterProviders,
        loadEntities,
        loadSourceTypes,
        loadAppTypes,
        pageAndSize,
        setProviderFilterColumn
    },
    dispatch);

const mapStateToProps = (
    { providers: {
        filterValue,
        loaded,
        numberOfEntities,
        sourceTypesLoaded,
        sourceTypes,
        appTypes,
        entities,
        pageSize,
        pageNumber,
        fetchingError,
        ...others
    }
    }) => (
    {
        filterValue,
        loaded,
        numberOfEntities,
        sourceTypesLoaded,
        sourceTypes,
        appTypes,
        entities,
        pageSize,
        pageNumber,
        fetchingError,
        others
    }
);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(withRouter(SourcesPage)));
