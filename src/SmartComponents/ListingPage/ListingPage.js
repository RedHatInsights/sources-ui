import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Breadcrumbs, PageHeader, PageHeaderTitle, Section } from '@red-hat-insights/insights-frontend-components';
import FilterDropdown from './FilterDropdown';
import { Button, TextInput, DropdownItem } from '@patternfly/react-core';
import PropTypes from 'prop-types';

import ListingView from '../../PresentationalComponents/ListingView/ListingView';
import SimpleKebab from './SimpleKebab';
import { viewDefinitions } from '../../views/viewDefinitions';

class ListingPage extends Component {
    static propTypes = {
        location: PropTypes.any.isRequired,
        history: PropTypes.any.isRequired
    }

    onNavigate = (_event, navigate, _index) => {
        this.props.history.push(navigate);
    }

    loadDefinition = () => viewDefinitions[this.props.location.pathname.split('/').pop()]

    constructor(props) {
        super(props);
        this.state = { viewDefinition: this.loadDefinition() };
    }

    componentDidUpdate = (prevProps, _prevState) => {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            this.setState({ viewDefinition: this.loadDefinition() });
        }
    }

    render = () => (
        <React.Fragment>
            <PageHeader>
                <PageHeaderTitle title='Providers'/>
                {/**<ConnectedBreadcrumbs current="Place" />**/}
                <Breadcrumbs
                    items={[
                        { title: 'Sources', navigate: '/sources' }
                    ]}
                    current={this.state.viewDefinition.displayName}
                    onNavigate={this.onNavigate}
                />
            </PageHeader>
            <Section type='content'>
                <div className='pf-c-input-group'>
                    <FilterDropdown />
                    <TextInput id='filter_text' value=''/>
                    <Button>Action</Button>
                    <SimpleKebab dropdownItems={
                        [<DropdownItem key='foo' component='div'><Link to={'/providers/'}>Back to Providers</Link></DropdownItem>]
                    }/>
                </div>
                <ListingView viewDefinition={this.state.viewDefinition}/>
            </Section>
        </React.Fragment>
    )
};

export default withRouter(ListingPage);
