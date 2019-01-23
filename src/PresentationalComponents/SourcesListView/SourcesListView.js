import PropTypes from 'prop-types';
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { TopologyIcon } from '@patternfly/react-icons';
import { Pagination, Table } from '@red-hat-insights/insights-frontend-components';
import flatten from 'lodash/flatten';
import filter from 'lodash/filter';
import ContentLoader from 'react-content-loader';

import Actions from './Actions';
import { loadEntities, selectEntity, expandEntity, sortEntities, pageAndSize } from '../../redux/actions/providers';
import DetailView from '../../PresentationalComponents/DetailView/DetailView';

import { sourcesViewDefinition } from '../../views/sourcesViewDefinition';

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
        this.headers = this.filteredColumns.map(col => col.title);

        this.state = {
            itemsPerPage: 10,
            onPage: 1,
            sortBy: {}
        };
    }

    componentDidMount = () => this.props.loadEntities();

    onRowClick = (_event, key, application) => {
        console.log('onRowClick', key, application);
    }

    onItemSelect = (_event, key, checked) => this.props.selectEntity(key, checked);

    onSort = (_event, key, direction) => {
        this.props.sortEntities(this.filteredColumns[key].value, direction);
        this.setState({
            sortBy: {
                index: key,
                direction
            }
        });
    }

    onExpandClick = (_event, _row, rowKey) => this.props.expandEntity(rowKey, true);

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

    render = () => {
        const { entities, loaded } = this.props;
        const data = flatten(entities.map((item, index) => (
            [
                {
                    ...item,
                    children: [index + 1],
                    cells: [].concat(
                        this.filteredColumns.map(col => item[col.value] || ''),
                        [
                            <Actions key='foo' item={item} />,
                            <Link key='bar' to={`/source/${item.id}/topology`}><TopologyIcon /></Link>
                        ]
                    )
                },
                {
                    id: item.id + '_detail',
                    isOpen: item.expanded,
                    cells: [
                        {
                            title: item.expanded ? <DetailView sourceId={item.id}/> : 'collapsed content',
                            colSpan: 6
                        }
                    ]
                }
            ]
        )));

        if (loaded) {
            return (
                <Table
                    widget-id="sourcesMainTable"
                    className="pf-m-compact ins-entity-table"
                    expandable={true}
                    sortBy={this.state.sortBy}
                    header={[...this.headers, '', '']}
                    //header={columns && {
                    //    ...mapValues(keyBy(columns, item => item.key), item => item.title),
                    //    health: {
                    //        title: 'Health',
                    //        hasSort: false
                    //    },
                    //    action: ''
                    //}}
                    onSort={this.onSort}
                    onRowClick={this.onRowClick}
                    onItemSelect={this.onItemSelect}
                    onExpandClick={this.onExpandClick}
                    hasCheckbox
                    rows={data}
                    footer={
                        <Pagination
                            itemsPerPage={this.state.itemsPerPage}
                            page={this.state.onPage}
                            direction='up'
                            onSetPage={this.onSetPage}
                            onPerPageSelect={this.onPerPageSelect}
                            numberOfItems={data ? this.props.numberOfEntities : 0}
                        />
                    }
                />
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
    pageAndSize: PropTypes.func.isRequired,

    entities: PropTypes.arrayOf(PropTypes.any),
    numberOfEntities: PropTypes.number.isRequired,
    loaded: PropTypes.bool.isRequired
};

SourcesListView.defaultProps = {
    entities: [],
    numberOfEntities: 0,
    loaded: false
};

const mapDispatchToProps = dispatch => bindActionCreators({
    loadEntities, selectEntity, expandEntity, sortEntities, pageAndSize }, dispatch);

const mapStateToProps = ({ providers: { entities, numberOfEntities, loaded } }) => ({ entities, numberOfEntities, loaded });

export default connect(mapStateToProps, mapDispatchToProps)(SourcesListView);

