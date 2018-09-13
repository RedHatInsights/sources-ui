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
        const { entities, expanded } = this.props;
        console.log('expanded: ', expanded);
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
              isOpen: item.id == expanded,
              cells: [{ title: 'collapsed content', colSpan: 5 }]
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

    render_old() {
      return (
        <ListView id="listView--listItemVariants" className="listView--listItemVariants">
          <ListView.Item
            id="item1"
            className="listViewItem--listItemVariants"
            key="item1"
            description="Expandable item with description, additional items and actions"
            heading="Event One"
            checkboxInput={<input type="checkbox" />}
            leftContent={<ListView.Icon name="plane" />}
            additionalInfo={[
              <ListView.InfoItem key="1">
                <BrushIcon /> Item 1
              </ListView.InfoItem>,
              <ListView.InfoItem key="2">
                <BugIcon /> Item 2
              </ListView.InfoItem>,
            ]}
            actions={
              <div>
                <Button>Action 1</Button>
                <DropdownKebab id="action2kebab" pullRight>
                  <MenuItem>Action 2</MenuItem>
                </DropdownKebab>
              </div>
            }
            stacked={false}
          >
            Expanded Content
          </ListView.Item>
          <ListView.Item
            key="item2"
            leftContent={<ListView.Icon size="lg" name="plane" />}
            heading={
              <span>
                This is EVENT One that is with very LONG and should not overflow and push other elements out of the bounding
                box.
                <small>Feb 23, 2015 12:32 am</small>
              </span>
            }
            actions={
              <div>
                <Button>Action 1</Button>
                <DropdownKebab id="action2kebab" pullRight>
                  <MenuItem>Action 2</MenuItem>
                </DropdownKebab>
              </div>
            }
            description={
              <span>
                The following snippet of text is rendered as <a href="">link text</a>.
              </span>
            }
            stacked={false}
          />
          <ListView.Item
            key="item3"
            checkboxInput={<input type="checkbox" />}
            heading="Stacked Additional Info items"
            description={
              <span>
                The following snippet of text is rendered as <a href="">link text</a>.
              </span>
            }
            additionalInfo={[
              <ListView.InfoItem key="1" stacked>
                <strong>113,735</strong>
                <span>Service One</span>
              </ListView.InfoItem>,
              <ListView.InfoItem key="2" stacked>
                <strong>35%</strong>
                <span>Service Two</span>
              </ListView.InfoItem>,
            ]}
            stacked={false}
          />
          <ListView.Item
            key="item4"
            additionalInfo={[
              <ListView.InfoItem key="1">
                <ShareIcon /> Only Additional
              </ListView.InfoItem>,
              <ListView.InfoItem key="2">
                <ServerIcon /> Info Items
              </ListView.InfoItem>,
            ]}
            stacked={false}
          />
        </ListView>
      )
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
  {inventory:{rows = [], entities = [], expanded}}) => ({entities, rows, expanded}
)

//export default EntityListView;
export default connect(mapStateToProps, mapDispatchToProps)(EntityListView)

