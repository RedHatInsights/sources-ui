import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
// import asyncComponent from '../../Utilities/asyncComponent';
//import './sample-page.scss';

//import { Donut, PageHeader, PageHeaderTitle, Section } from '@red-hat-insights/insights-frontend-components';
import { Breadcrumbs } from '@red-hat-insights/insights-frontend-components';

//import { Button, Grid, GridItem } from '@patternfly/react-core';
import FilterDropdown from './FilterDropdown';
import { Button, TextInput, DropdownItem } from '@patternfly/react-core';

import ListingView from '../../PresentationalComponents/ListingView/ListingView';
import SimpleKebab from './SimpleKebab';

class ListingPage extends Component {
    render() {
        return (
            <React.Fragment>
                {/**<ConnectedBreadcrumbs current="Place" />**/}
                <Breadcrumbs
                  items={[{title: 'Providers', navigate: 'providers'}, {title: 'VMs', navigate: 'topologyui/vms'}]}
                  current='VMs'
                />
                <div className='pf-c-input-group'>
                  <FilterDropdown />
                  <TextInput id='filter_text' />
                  <Button>Action</Button>
                  <SimpleKebab>
                    <DropdownItem><Link to={'/providers/'}>Back to Providers</Link></DropdownItem>
                  </SimpleKebab>
                </div>
                <ListingView />
            </React.Fragment>
        )
    }
};

export default withRouter(ListingPage);
