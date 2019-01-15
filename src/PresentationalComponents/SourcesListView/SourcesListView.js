import PropTypes from 'prop-types';
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { ListView, Row, Col, DropdownKebab, MenuItem } from 'patternfly-react';
import { BrushIcon, BugIcon, ShareIcon, TopologyIcon } from '@patternfly/react-icons';
import { Button } from '@patternfly/react-core';
import { Pagination, Table } from '@red-hat-insights/insights-frontend-components';
import { RowLoader } from '@red-hat-insights/insights-frontend-components/Utilities/helpers'
import flatten from 'lodash/flatten'
import filter from 'lodash/filter';

import Actions from './Actions';
import { loadEntities, selectEntity, expandEntity, sortEntities, pageAndSize } from '../../redux/actions/providers';
import DetailView from '../../PresentationalComponents/DetailView/DetailView';

import { sourcesViewDefinition } from '../../views/sourcesViewDefinition'

class SourcesListView extends React.Component {
    constructor(props) {
        super(props);

        this.filteredColumns = filter(sourcesViewDefinition.columns, c => c.title);
        this.headers = this.filteredColumns.map(col => col.title);

        this.state = {
            itemsPerPage: 10,
            onPage: 1,
            sortBy: {}
        }
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
              direction: direction,
            }
        });
    }

    onExpandClick = (_event, _row, rowKey) => this.props.expandEntity(rowKey, true);

    onSetPage = (number) => {
        this.setState({
            onPage: number,
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
        const { entities, rows, loaded } = this.props;
        const data = flatten(entities.map((item, index) => (
          [
            {
              ...item,
              children: [index + 1],
              cells: [].concat(
                  this.filteredColumns.map(col => item[col.value] || ''),
                  [
                    <Actions item={item} />,
                    <Link to={`/source/${item.id}/topology`}><TopologyIcon /></Link>
                  ]
              )
            },
            {
              id: item.id + '_detail',
              isOpen: item.expanded,
              cells: [
                {
                  title: item.expanded ? <DetailView /> : 'collapsed content',
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
          )
        }

        return <Table
              widget-id="sourcesMainTable"
              className="pf-m-compact ins-entity-table"
              expandable={true}
              sortBy={this.state.sortBy}
              header={[...this.headers, '', '']}
              onSort={this.onSort}
              onRowClick={this.onRowClick}
              onItemSelect={this.onItemSelect}
              onExpandClick={this.onExpandClick}
              hasCheckbox
              rows={[<RowLoader />, <RowLoader />, <RowLoader />]}
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
    }
};

SourcesListView.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        title: PropTypes.string
    })).isRequired
};

SourcesListView.defaultProps = {
    rows: [],
    entities: [],
    numberOfEntities: 0,
    loaded: false
};

const mapDispatchToProps = dispatch => bindActionCreators({ loadEntities, selectEntity, expandEntity, sortEntities, pageAndSize }, dispatch);

const mapStateToProps = ({providers:{rows, entities, numberOfEntities, loaded}}) => ({entities, rows, numberOfEntities, loaded});

export default connect(mapStateToProps, mapDispatchToProps)(SourcesListView);

