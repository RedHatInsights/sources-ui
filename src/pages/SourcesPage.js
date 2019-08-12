import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link, withRouter, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { TableToolbar, PageHeader, PageHeaderTitle, Pagination, Section } from '@red-hat-insights/insights-frontend-components';
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

import SourcesSimpleView from '../components/SourcesSimpleView';
import SourcesFilter from '../components/SourcesFilter';
import SourcesEmptyState from '../components/SourcesEmptyState';
import SourceEditModal from '../components/SourceEditModal';
import SourceRemoveModal from '../components/SourceRemoveModal';
import AddApplication from '../components/AddApplication/AddApplication';
import { sourcesViewDefinition } from '../views/sourcesViewDefinition';
import { pageAndSize } from '../redux/actions/providers';
import { paths } from '../Routes';

class SourcesPage extends Component {
    state = {
        itemsPerPage: 10,
        onPage: 1
    };

    componentDidMount() {
        return Promise.all([this.props.loadSourceTypes(), this.props.loadAppTypes(), this.props.loadEntities()]);
    }

    onFilter = (filterValue) => this.props.filterProviders(filterValue);

    onFilterSelect = (_component, column) => this.props.setProviderFilterColumn(column.value);

    onSetPage = (number) => {
        this.setState({
            onPage: number
        });
        this.props.pageAndSize(number, this.state.itemsPerPage);
    }

    onPerPageSelect = (count) => {
        this.setState({
            onPage: 1,
            itemsPerPage: count
        });
        this.props.pageAndSize(1, count);
    }

    renderMainContent = () => (
        <React.Fragment>
            <TableToolbar xresults={this.props.numberOfEntities}>
                <Split gutter="md" style={{ flexGrow: 1 }}>
                    <SplitItem>
                        <SourcesFilter
                            columns={filter(sourcesViewDefinition.columns(this.props.intl), c => c.searchable)}
                            onFilter={this.onFilter}
                            onFilterSelect={this.onFilterSelect}/>
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
                            itemsPerPage={this.state.itemsPerPage}
                            page={this.state.onPage}
                            direction='down'
                            onSetPage={this.onSetPage}
                            onPerPageSelect={this.onPerPageSelect}
                            numberOfItems={this.props.numberOfEntities || 0}
                        />
                    </SplitItem>
                </Split>
            </TableToolbar>
            <SourcesSimpleView columns={sourcesViewDefinition.columns(this.props.intl)}/>
            <TableToolbar>
                <Pagination
                    itemsPerPage={this.state.itemsPerPage}
                    page={this.state.onPage}
                    direction='up'
                    onSetPage={this.onSetPage}
                    onPerPageSelect={this.onPerPageSelect}
                    numberOfItems={this.props.numberOfEntities || 0}
                />
            </TableToolbar>
        </React.Fragment>
    );

    render = () => {
        const { numberOfEntities } = this.props;
        const displayEmptyState = this.props.loaded &&      // already loaded
            !this.props.filterValue &&                      // no filter active
            (!numberOfEntities || numberOfEntities === 0);  // no records do display

        const editorNew = this.props.location.pathname === paths.sourcesNew;
        const editorEdit = this.props.match.path === paths.sourcesEdit;

        return (
            <React.Fragment>
                <Route exact path={paths.sourceManageApps} component={ AddApplication } />
                <Route exact path={paths.sourcesRemove} component={ SourceRemoveModal } />
                { editorNew && <AddSourceWizard
                    sourceTypes={this.props.sourceTypes}
                    applicationTypes={this.props.appTypes}
                    isOpen={true}
                    onClose={() => this.props.history.replace('/')}
                    afterSuccess={() => this.props.loadEntities()}
                />}
                { editorEdit && <SourceEditModal />}
                <PageHeader>
                    <PageHeaderTitle title={this.props.intl.formatMessage({
                        id: 'sources.sources',
                        defaultMessage: 'Sources'
                    })}/>
                </PageHeader>
                <Section type='content'>
                    {displayEmptyState ? <SourcesEmptyState /> : this.renderMainContent()}
                </Section>
            </React.Fragment>
        );
    }
}

SourcesPage.propTypes = {
    filterProviders: PropTypes.func.isRequired,
    setProviderFilterColumn: PropTypes.func.isRequired,
    loadEntities: PropTypes.func.isRequired,
    loadSourceTypes: PropTypes.func.isRequired,
    loadAppTypes: PropTypes.func.isRequired,
    pageAndSize: PropTypes.func.isRequired,
    sourceTypes: PropTypes.array,
    appTypes: PropTypes.array,

    filterValue: PropTypes.string,
    loaded: PropTypes.bool.isRequired,
    numberOfEntities: PropTypes.number.isRequired, // total number of Sources

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
    { providers: { filterValue, loaded, numberOfEntities, sourceTypesLoaded, sourceTypes, appTypes } }) => (
    { filterValue, loaded, numberOfEntities, sourceTypesLoaded, sourceTypes, appTypes }
);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(withRouter(SourcesPage)));
