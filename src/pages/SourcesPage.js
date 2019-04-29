import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link, withRouter, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { TableToolbar, PageHeader, PageHeaderTitle, Pagination, Section } from '@red-hat-insights/insights-frontend-components';
import {
    filterProviders,
    loadEntities,
    loadSourceTypes,
    setProviderFilterColumn
} from '../redux/actions/providers';
import { Button } from '@patternfly/react-core';
import { SplitItem, Split } from '@patternfly/react-core';
import filter from 'lodash/filter';

import SourcesSimpleView from '../components/SourcesSimpleView';
import SourcesFilter from '../components/SourcesFilter';
import SourcesEmptyState from '../components/SourcesEmptyState';
import SourceEditModal from '../components/SourceEditModal';
import SourceRemoveModal from '../components/SourceRemoveModal';
import { sourcesViewDefinition } from '../views/sourcesViewDefinition';
import { pageAndSize } from '../redux/actions/providers';
import { paths } from '../Routes';

/**
 * A smart component that handles all the api calls and data needed by the dumb components.
 * Smart components are usually classes.
 *
 * https://reactjs.org/docs/components-and-props.html
 * https://medium.com/@thejasonfile/dumb-components-and-smart-components-e7b33a698d43
 */
class SourcesPage extends Component {
    componentDidMount = () => this.props.loadSourceTypes()
    .then(() => this.props.loadEntities());

    constructor (props) {
        super(props);

        this.state = {
            itemsPerPage: 10,
            onPage: 1
        };
    }

    onFilter = (filterValue) => {
        console.log('onFilter', filterValue);
        this.props.filterProviders(filterValue);
    }

    onFilterSelect = (_component, column) => {
        console.log('onFilter', column);
        this.props.setProviderFilterColumn(column.value);
    }

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
                            columns={filter(sourcesViewDefinition.columns, c => c.searchable)}
                            onFilter={this.onFilter}
                            onFilterSelect={this.onFilterSelect}/>
                    </SplitItem>
                    <SplitItem>
                        <Link to={paths.sourcesNew}>
                            <Button variant='primary'> Add a source </Button>
                        </Link>
                    </SplitItem>
                    <SplitItem style={{ flexGrow: 1 }}>
                        <Pagination
                            itemsPerPage={this.state.itemsPerPage}
                            page={this.state.onPage}
                            direction='up'
                            onSetPage={this.onSetPage}
                            onPerPageSelect={this.onPerPageSelect}
                            numberOfItems={this.props.numberOfEntities || 0}
                        />
                    </SplitItem>
                </Split>
            </TableToolbar>
            <SourcesSimpleView columns={sourcesViewDefinition.columns}/>
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
                <Route exact path={paths.sourcesRemove} component={ SourceRemoveModal } />
                { editorNew || editorEdit ? <SourceEditModal /> : '' }
                <PageHeader>
                    <PageHeaderTitle title='Sources'/>
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
    pageAndSize: PropTypes.func.isRequired,

    filterValue: PropTypes.string,
    loaded: PropTypes.bool.isRequired,
    numberOfEntities: PropTypes.number.isRequired, // total number of Sources

    location: PropTypes.any.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.any.isRequired
};

const mapDispatchToProps = dispatch => bindActionCreators(
    { filterProviders, loadEntities, loadSourceTypes, pageAndSize, setProviderFilterColumn }, dispatch);

const mapStateToProps = ({ providers: { filterValue, loaded, numberOfEntities } }) => (
    { filterValue, loaded, numberOfEntities }
);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SourcesPage));
