import PropTypes from 'prop-types';
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { TopologyIcon } from '@patternfly/react-icons';
import { Table, TableHeader, TableBody, sortable } from '@patternfly/react-table';

import flatten from 'lodash/flatten';
import filter from 'lodash/filter';
import reduce from 'lodash/reduce';
import ContentLoader from 'react-content-loader';

import { loadEntities, selectEntity, expandEntity, sortEntities } from '../../redux/actions/providers';
import DetailView from '../../PresentationalComponents/DetailView/DetailView';

import { sourcesViewDefinition } from '../../views/sourcesViewDefinition';
import { viewDefinitions } from '../../views/viewDefinitions';

const RowLoader = props => (
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

class SourcesListView extends React.Component {
    constructor(props) {
        super(props);

        this.filteredColumns = filter(sourcesViewDefinition.columns, c => c.title);

        this.headers = this.filteredColumns.map(col => ({
            title: col.title,
            transforms: [sortable]
        })).concat('');

        this.state = {
            sortBy: {}
        };
    }

    //onSelect = (_event, key, application) => {
    //    console.log('onSelect', key, application);
    //}

    onItemSelect = (_event, key, checked) => this.props.selectEntity(key, checked);

    onSort = (_event, key, direction) => {
        // -1 for the expander column
        this.props.sortEntities(this.filteredColumns[key - 1].value, direction);
        this.setState({
            sortBy: {
                index: key,
                direction
            }
        });
    }

    onExpandClick = (_event, _row, rowKey) => this.props.expandEntity(rowKey, true);

    onCollapse = (_event, i, isOpen) =>
        this.props.expandEntity(this.sourceIndexToId(i), isOpen);

    sourceIndexToId = (i) => this.props.entities[i / 2].id;

    renderActions = () => (
        [
            {
                title: 'Show Details',
                onClick: (_ev, i) => this.props.history.push(`/${this.sourceIndexToId(i)}`)
            },
            ...this.renderViewLinks()
        ]
    );

    renderViewLinks = () =>
        reduce(Object.keys(viewDefinitions), (acc, viewName) => (
            acc.push(
                {
                    title: `Show ${viewDefinitions[viewName].displayName}`,
                    onClick: (_ev, i) => this.props.history.push(`/${this.sourceIndexToId(i)}/${viewName}`)
                }
            ) && acc
        ), []);

    render = () => {
        const { entities, loaded } = this.props;
        const rowData = flatten(entities.map((item, index) => (
            [
                {
                    ...item,
                    isOpen: !!item.expanded,
                    cells: this.filteredColumns.map(col => item[col.value] || '').concat({
                        title: <Link key='bar' to={`/${item.id}/topology`}><TopologyIcon /></Link>
                    })
                },
                {
                    id: item.id + '_detail',
                    parent: index,
                    cells: [
                        {
                            title: item.expanded ? <DetailView sourceId={item.id}/> : 'collapsed content',
                            colSpan: 6
                        }
                    ]
                }
            ]
        )));
        // console.log(rowData);

        if (loaded) {
            return (
                <Table
                    aria-label="List of Sources"
                    onCollapse={this.onCollapse}
                    onSort={this.onSort}
                    sortBy={this.state.sortBy}
                    rows={rowData}
                    cells={this.headers}
                    actions={this.renderActions()}
                >
                    <TableHeader />
                    <TableBody />
                </Table>
            );
        }

        return (
            <table className="sources-placeholder-table pf-m-compact ins-entity-table">
                <tbody>
                    <tr><td><RowLoader /></td></tr>
                    <tr><td><RowLoader /></td></tr>
                </tbody>
            </table>
        );
    }
};

SourcesListView.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        title: PropTypes.string
    })).isRequired,

    loadEntities: PropTypes.func.isRequired,
    selectEntity: PropTypes.func.isRequired,
    expandEntity: PropTypes.func.isRequired,
    sortEntities: PropTypes.func.isRequired,

    entities: PropTypes.arrayOf(PropTypes.any),
    numberOfEntities: PropTypes.number.isRequired,
    loaded: PropTypes.bool.isRequired,

    history: PropTypes.any.isRequired
};

SourcesListView.defaultProps = {
    entities: [],
    numberOfEntities: 0,
    loaded: false
};

const mapDispatchToProps = dispatch => bindActionCreators({
    loadEntities, selectEntity, expandEntity, sortEntities }, dispatch);

const mapStateToProps = ({ providers: { entities, numberOfEntities, loaded } }) => ({ entities, numberOfEntities, loaded });

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SourcesListView));

