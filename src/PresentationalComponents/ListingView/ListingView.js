import React, { Component } from 'react';
import { Pagination, Table } from '@red-hat-insights/insights-frontend-components';
import { connect } from 'react-redux';
import filter from 'lodash/filter';

import { loadListingData, sortListingData, pageAndSize } from '../../redux/actions/listing';
import { viewDefinitions } from '../../views/viewDefinitions'

class ListingView extends Component {
    constructor(props) {
        super(props);

        this.onSort = this.onSort.bind(this)
        this.onSetPage = this.onSetPage.bind(this);
        this.onPerPageSelect = this.onPerPageSelect.bind(this);

        this.filteredColumns = filter(viewDefinitions.container_projects.columns, c => c.title);
        this.headers = this.filteredColumns.map(col => col.title);

        this.state = {
            itemsPerPage: 10,
            onPage: 1,
            sortBy: {}
        }
    }

    componentDidMount() {
        this.props.loadListingData();
    }

    onSort(_event, key, direction) {
        this.props.sortListingData(this.filteredColumns[key].value, direction);
        this.setState({
            sortBy: {
              index: key,
              direction: direction,
            }
        });
    }

    mapDataToRows(data) {
        return data.map(row => ({
            id: row.id,
            cells: this.filteredColumns.map(col => row[col.value] || '')
        }));
    }

    onSetPage(number) {
        this.setState({
            onPage: number,
        });
        this.props.pageAndSize(number, this.state.itemsPerPage);
    }

    onPerPageSelect(count) {
        this.setState({
            onPage: 1,
            itemsPerPage: count
        });
        this.props.pageAndSize(1, count);
    }

    render() {
        return (
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
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        loadListingData: () => dispatch(loadListingData()),
        sortListingData: (column, direction) => dispatch(sortListingData(column, direction)),
        pageAndSize: (page, size) => dispatch(pageAndSize(page, size)),
    }
}

const mapStateToProps = ({listing:{listingRows = [], rawRows = []}}) => ({listingRows, rawRows})

export default connect(mapStateToProps, mapDispatchToProps)(ListingView);
