import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Pagination, Table } from '@red-hat-insights/insights-frontend-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import filter from 'lodash/filter';

import { loadListingData, sortListingData, pageAndSize } from '../../redux/actions/listing';

/* FIXME */
/*eslint react/prop-types: 1*/

class ListingView extends Component {
    static propTypes = {
        viewDefinition: PropTypes.any.isRequired
    }

    constructor(props) {
        super(props);
        this.filteredColumns = filter(this.props.viewDefinition.columns, c => c.title);
        this.headers = this.filteredColumns.map(col => col.title);
    }

    state = {
        itemsPerPage: 10,
        onPage: 1,
        sortBy: {}
    }

    componentDidMount = () => {
        this.props.loadListingData(this.props.viewDefinition);
    }

    onSort = (_event, key, direction) => {
        this.props.sortListingData(this.filteredColumns[key].value, direction);
        this.setState({
            sortBy: {
                index: key,
                direction
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

    render = () =>
        this.props.loaded ?
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
            /> :
            <div>Loading data...</div>
}

const mapDispatchToProps = dispatch => bindActionCreators({ loadListingData, sortListingData, pageAndSize }, dispatch);

const mapStateToProps = ({ listing: { loaded = false, listingRows = [], rawRows = [] } }) => ({ loaded, listingRows, rawRows });

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ListingView));
