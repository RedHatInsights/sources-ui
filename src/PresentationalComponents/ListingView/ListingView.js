import React, { Component } from 'react';
import { Pagination, Table } from '@red-hat-insights/insights-frontend-components';
import { connect } from 'react-redux';

import { loadListingData, sortListingData, pageAndSize } from '../../redux/actions/listing';

class ListingView extends Component {
    constructor(props) {
        super(props);

        this.onSort = this.onSort.bind(this)
        this.onSetPage = this.onSetPage.bind(this);
        this.onPerPageSelect = this.onPerPageSelect.bind(this);

        this.columns = ['Name', 'Cluster', 'Host', 'IP Address', 'DataStore']
        this.realColumns = ['name', 'cluster', 'host', 'ip_address', 'datastore']

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
        this.props.sortListingData(this.realColumns[key], direction);
        this.setState({
            sortBy: {
              index: key,
              direction: direction,
            }
        });
    }

    mapDataToRows(data) {
        return data.map(item => (
            {
                id: item.id,
                cells: this.realColumns.map(name => item[name])
            }
        ));
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
                header={this.columns}
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
