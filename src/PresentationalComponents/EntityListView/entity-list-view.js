import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { ListView, Row, Col, DropdownKebab, MenuItem } from 'patternfly-react';

import { BrushIcon, BugIcon, ShareIcon, ServerIcon } from '@patternfly/react-icons';
import { Button } from '@patternfly/react-core';

import { Pagination, Table } from '@red-hat-insights/insights-frontend-components';

import flatten from 'lodash/flatten'

import Actions from './Actions';

import { loadEntities, selectEntity, expandEntity } from '../../redux/actions/entity_list';
import DetailView from '../../PresentationalComponents/DetailView/DetailView';

class EntityListView extends React.Component {
    constructor(props) {
        super(props);

        this.onRowClick = this.onRowClick.bind(this);
        this.onItemSelect = this.onItemSelect.bind(this);
        this.onSort = this.onSort.bind(this)
        this.onExpandClick = this.onExpandClick.bind(this)

        this.state = {
        //    sortBy: {}
        }
    }

    componentDidMount() {
        this.props.loadEntities();
    }

    onRowClick(_event, key, application) {
        console.log('onRowClick', key, application);
    }

    onItemSelect(_event, key, checked) {
        console.log('onItemSelect', key, checked);
        this.props.selectEntity(key, checked);
    }

    onSort(_event, key, direction) {
    }

    onExpandClick(_event, _row, rowKey) {
        console.log('onExpandClick', _row, rowKey);
        this.props.expandEntity(rowKey, true);
    }

    render() {
        const { entities } = this.props;
        const data = flatten(entities.map((item, index) => (
          [
            {
              ...item,
              children: [index + 1],
              cells: [
                item.name,
                'OK',
                item.type,
                (new Date).toDateString(),
                <Actions item={item} />
              ]
            },
            {
              id: item.id + '_detail',
              isOpen: item.expanded,
              cells: [
                {
                  title: item.expanded ? <DetailView /> : 'collapsed content',
                  colSpan: 5
                }
              ]
            }
          ]
        )));

        console.log(data);

        return <Table
            className="pf-m-compact ins-entity-table"
            expandable={true}
            //sortBy={this.state.sortBy}
            header={['Provider', 'Status', 'Type', 'Last Updated', '']}
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
            footer={<Pagination numberOfItems={10}/>}
        />
    }
};

EntityListView.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

function mapDispatchToProps(dispatch) {
    return {
        loadEntities: () => dispatch(loadEntities()),
        selectEntity: (key, selected) => dispatch(selectEntity(key, selected)),
        expandEntity: (key, expanded) => dispatch(expandEntity(key, expanded)),
        //filterEntities: (key = 'display_name', filterBy) => dispatch(filterEntities(key, filterBy))
    }
}

const mapStateToProps = (
  {inventory:{rows = [], entities = []}}) => ({entities, rows}
)

//export default EntityListView;
export default connect(mapStateToProps, mapDispatchToProps)(EntityListView)

