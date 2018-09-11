import React, { Component } from 'react';
import { Pagination, Table } from '@red-hat-insights/insights-frontend-components';
import { join, times } from 'lodash'

class ListingView extends Component {
    constructor(props) {
        super(props);

        //this.onRowClick = this.onRowClick.bind(this);
        //this.onItemSelect = this.onItemSelect.bind(this);
        this.onSort = this.onSort.bind(this)

        this.state = {
        //    sortBy: {}
        }
    }

    onSort(_event, key, direction) {
    }

    randomData(num) {
        var rows = []
        for (var i = 1; i <= num; i++) {
            rows.push({
                id: i, 
                cells: [
                    `foobar ${Math.round(Math.random()*1000)}`,
                    'Default',
                    `foo.bar.host${Math.round(Math.random()*1000)}`,
                    join(times(4, i => Math.round(Math.random()*256)), '.'),
                    'My store'
                ]
            });
        }
        return rows
    }

    render() {
        return (
            <Table
                header={['Name', 'Cluster', 'Host', 'IP Address', 'DataStore']}
                onSort={this.onSort}
                rows={this.randomData(10)}
                footer={<Pagination numberOfItems={10}/>}
            />
        )
    }
}

export default ListingView;
