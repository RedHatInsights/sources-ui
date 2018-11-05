import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Pagination, Table } from '@red-hat-insights/insights-frontend-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import filter from 'lodash/filter';

import { loadListingData, sortListingData, pageAndSize } from '../../redux/actions/listing';
import { viewDefinitions } from '../../views/viewDefinitions'

class ListingView extends Component {
    constructor(props) {
        super(props);

        const viewName = this.props.location.pathname.split('/').pop();
        this.viewDefinition = viewDefinitions[viewName];

        this.filteredColumns = filter(this.viewDefinition.columns, c => c.title);
        this.headers = this.filteredColumns.map(col => col.title);
    }

    state = {
        itemsPerPage: 10,
        onPage: 1,
        sortBy: {}
    }

    componentDidMount = () => {
        this.props.loadListingData(this.viewDefinition);
    }

    onSort = (_event, key, direction) => {
        this.props.sortListingData(this.filteredColumns[key].value, direction);
        this.setState({
            sortBy: {
              index: key,
              direction: direction,
            }
        });
    }

    mapDataToRows = (data) => data.map(
        row => ({
            id: row.id,
            cells: this.filteredColumns.map(col => row[col.value] || '')
        })
    );

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

    render = () =>
        <Table
            sortBy={this.state.sortBy}
            header={this.headers}
            onSort={this.onSort}
            rows={this.mapDataToRows(this.props.listingRows)}
            footer={
                <Pagination
                    itemsPerPage={this.state.itemsPerPage}
                    page={this.state.onPage}
                    direction='up'
                    onSetPage={this.onSetPage}
                    onPerPageSelect={this.onPerPageSelect}
                    numberOfItems={this.props.rawRows ? this.props.rawRows.length : 0}
                />
            }
        />
}

const mapDispatchToProps = dispatch => bindActionCreators({ loadListingData, sortListingData, pageAndSize }, dispatch)

const mapStateToProps = ({listing:{listingRows = [], rawRows = []}}) => ({listingRows, rawRows})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ListingView));
